const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


let profile_data = NaN;
let certificateData = {};

fetch('https://raw.githubusercontent.com/SatyaHimavanth/Portfolio-website/refs/heads/main/base_resume.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    profile_data = data;
    populate_page();
  })
  .catch(error => {
    console.error('Error fetching the JSON file:', error);
    profile_data = NaN;
  });

function populate_page(){
    for(cert in profile_data["certifications"]){
        certificateData[cert] = profile_data["certifications"][cert];
    }

    basic_details();
    skills();
    education();
    certifications();

    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
        observer.observe(element);
    });
}

function basic_details(){
    document.getElementById("name").innerText = profile_data['name'];
    document.getElementById("home-section").innerHTML = `<h1>Hi, I'm ${profile_data['name']}</h1> <p>${profile_data['profession']}</p>`
}

function skills() {
    const skills_section = document.getElementById("skills-section");

    for (let key in profile_data["skills"]) {
        let categoryDiv = document.createElement("div");
        categoryDiv.classList.add("skill-category", "animate-on-scroll");

        categoryDiv.innerHTML = `<h3>${key}</h3>`;

        let skillTagsDiv = document.createElement("div");
        skillTagsDiv.classList.add("skill-tags");

        for (let skill of profile_data["skills"][key]) {
            let skillTagSpan = document.createElement("span");
            skillTagSpan.classList.add("skill-tag");
            skillTagSpan.textContent = skill;

            skillTagsDiv.appendChild(skillTagSpan);
        }
        categoryDiv.appendChild(skillTagsDiv);
        skills_section.appendChild(categoryDiv);
    }
}

function education(){
    const education_section = document.getElementById("education-section");

    for (let edu of profile_data["education"]) {
        let categoryDiv = document.createElement("div");
        categoryDiv.classList.add("education-card", "animate-on-scroll");

        const table = document.createElement("table");
        table.style.width = "100%";
        const headers = [{'Degree': 'degree'}, {'Institution': 'institution'}, {'Grade': 'grade'}, {'Graduation Year': 'graduation_year'}];
        for (header in headers){
            const Row = document.createElement("tr");
            const key = Object.keys(headers[header])[0];

            const th = document.createElement("th");
            th.textContent = key;
            th.style.width = "50%";
            th.style.textAlign = "left";
            Row.appendChild(th);

            const td = document.createElement("td");
            td.textContent = edu[headers[header][key]];
            th.style.width = "50%";
            th.style.textAlign = "left";
            Row.appendChild(td);

            table.appendChild(Row);
        }

        categoryDiv.appendChild(table);

        education_section.appendChild(categoryDiv);
    }
}

function certifications() {
    const certificationsSection = document.getElementById("certifications-section");
    const leftBtn = document.querySelector('.left-btn');
    const rightBtn = document.querySelector('.right-btn');

    // Clear existing content
    certificationsSection.innerHTML = '';

    // Add certificates
    for (let cert in certificateData) {
        const card = document.createElement('div');
        card.classList.add('certificate-card');

        const image = document.createElement('img');
        image.src = cert['certificate-link']; // Add a default placeholder image
        image.classList.add('certificate-image');
        
        const downloadIcon = document.createElement('div');
        downloadIcon.innerHTML = '⬇️'; // You can replace this with an actual icon
        downloadIcon.classList.add('download-icon');
        downloadIcon.onclick = (e) => {
            e.stopPropagation();
            downloadCertificate(certificateData[cert]['certificate-link']);
        };

        const title = document.createElement('h3');
        title.textContent = certificateData[cert].name;

        const institution = document.createElement('p');
        institution.textContent = certificateData[cert].institution;

        card.appendChild(image);
        card.appendChild(downloadIcon);
        card.appendChild(title);
        card.appendChild(institution);

        certificationsSection.appendChild(card);
    }

    // Scroll controls
    leftBtn.addEventListener('click', () => {
        certificationsSection.scrollBy({
            left: -320,
            behavior: 'smooth'
        });
    });

    rightBtn.addEventListener('click', () => {
        certificationsSection.scrollBy({
            left: 320,
            behavior: 'smooth'
        });
    });
}

function downloadCertificate(certificateLink) {
    if (!certificateLink) {
        alert('Certificate not available for download');
        return;
    }

    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = certificateLink.replace("/images", "/pdf");
    link.download = 'certificate.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}