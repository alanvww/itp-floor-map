// infoLoader.js

document.addEventListener('DOMContentLoaded', function() {
    const infoTitle = document.querySelector('#info-title');
    const infoContent = document.querySelector('#info-content');

    const infoData = {
        'North-Studio': {
            title: 'Faculty List',
            content: `Greg Shakar<br>
                John Henry Thompson<br>
                Sarah Rothberg<br>
                Sharon De La Cruz<br>
                Blair Simmons<br>
                Katherine Dillon<br>
                Dan O'Sullivan<br>
                Daniel Shiffman<br>
                Pedro Oliveira<br>
                MK Skitka<br>
                Dave Stein<br>
                Armon Naeini<br>
                Shuang Cai<br>
                Oscar Durand<br>
                Caren Ye<br>`
        },
        'South-Studio': {
            title: 'Faculty List',
            content: `Ali Santana<br>
                Marianne Petit<br>
                David Rios<br>
                Yeseul Song<br>
                Tom Igoe<br>
                Mimi Yin<br>
                Daniel Rozin<br>
                Maya Williams<br>
                Gracy Whelihan<br>
                Tuan Huang<br>
                Zoe Cohen<br>
                Suraj Barthy<br>
                Bianca Gan<br>
                Michelle Binyan Xu<br>
                Isaiah Bayas<br>`
        },
        'DocLab': {
            title: 'Doc Lab',
            content: `The Documentation Lab is a fully stocked, student-run client service for ITP/IMA student. Our team of mentors are available by appointment to help you present your project in the best possible light.<br>
                If you're interested in documenting your project, please take a few minutes and fill out our <a href='https://docs.google.com/forms/d/e/1FAIpQLSd4lh2pF9DAs22U7ASP3NQ95atOUcDz1Ch7SkziSeVaKK_4BQ/viewform'>Doc Lab Intake Form</a>. <br>
                Once you've submitted the requested information you'll receive an automated reply with more information on how to book an appointment. <br>`
        },
        'HyperLab': {
            title: 'Hyper Lab',
            content: `The Hyper Lab is a set of small spaces and computers that can be reserved for XR experimentation, project development which requires significant GPU-usage, and trying out VR experiences. The Hyper Lab is made up of four spaces, each with their own usage, equipment, reservation links, and community expectations. They include a Standing and sitting VR lab as well as a Develop and rendering labs.`
        },
        'ER': {
            title: 'The ER',
            content: `The Equipment Room is stocked with laptops, photography equipment, and an assortment of cables for all needs. This includes but is not limited to, HDMI, USB converters, Apple and Windows chargers. This is all on a checkout basis through staff working at the ER.`
        },
        'CodingLab': {
            title: 'Coding Lab',
            content: `The Coding Lab is a student-run help desk where NYU students can get help with their code. The students in the lab have experience with software such as HTML, CSS, Javascript, C++ and Python. It also uses software like Unreal, Unity and Blender`
        },
        'Shop': {
            title: 'The Shop',
            content: `The shop is equipped with 3 Ultimaker S3 3D printers, 2 Epilog Mini laser cutters, as well as one Epilog Pro. There is also a full wood fabrication shop with machines such as 4 Axis CNCs and Bandsaws. As well as a soft lab for sewing and embroidery, and a soldering area.`
        },
        'DesignLab': {
            title: 'Design Lab',
            content: `The Design Lab is a student and resident-run organization at ITP/IMA where students can get help with all design-related needs, including traditional graphic design and related practices (UX/UI, product design), as well as fabrication (including vinyl and UV printing services), and project development. Design Lab staff's primary focus is to support students through 1:1 help in office hours, or in groups by leading workshops on basic design software tools, such as Photoshop, Illustrator, InDesign, and Figma, as well as other relevant tools and processes.`
        }
    };

    function updateInfo(infoKey) {
        const info = infoData[infoKey];
        if (info) {
            infoTitle.innerHTML = info.title;
            infoContent.innerHTML = info.content;
        }
    }

    // Export the updateInfo function so it can be called from script.js
    window.updateInfo = updateInfo;

    // Add click listeners to all hover-group elements
    document.querySelectorAll('.hover-group').forEach(element => {
        element.addEventListener('click', function(e) {
            const infoKey = this.id;
            updateInfo(infoKey);
        });
    });
});