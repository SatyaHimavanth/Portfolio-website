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
    projects();
    education();
    certifications();

    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
        observer.observe(element);
    });
}

function basic_details(){
    document.getElementById("name").innerText = profile_data['name'];
    document.getElementById("home-section").innerHTML = `<h1>Hi, I'm ${profile_data['name']}</h1> <p>${profile_data['profession']}</p>`;
    document.getElementById("github_id").href = profile_data.contact.github;
    document.getElementById("email_id").innerHTML = profile_data.contact.email;
    document.getElementById("phone_no").innerHTML = profile_data.contact.phone;
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

function projects(){
    const projects_section = document.getElementById("projects-section");
    const projects_list = profile_data["projects"];
    for (let proj of projects_list) {
        let categoryDiv = document.createElement("div");
        categoryDiv.classList.add("projects-card", "animate-on-scroll");

        categoryDiv.innerHTML = `<h3>${proj.name}</h3>`;

        const desc = document.createElement("p");
        desc.innerHTML = proj.description;

        categoryDiv.appendChild(desc);

        const links = document.createElement("table");
        links.style.paddingTop = "20px";
        links.style.width = "100%";
        if(proj.githubLink){
            const Row = document.createElement("tr");
            const th = document.createElement("th");
            th.textContent = 'GitHub Link';
            th.style.width = "50%";
            th.style.textAlign = "left";
            Row.appendChild(th);

            const td = document.createElement("td");
            td.innerHTML = `<a href='${proj.githubLink}' target="_blank">${proj.githubLink}</a>`;
            th.style.width = "50%";
            th.style.textAlign = "left";
            Row.appendChild(td);

            links.appendChild(Row);
        }
        if(proj.hostingLink){
            const Row = document.createElement("tr");
            const th = document.createElement("th");
            th.textContent = 'Hosting Link';
            th.style.width = "50%";
            th.style.textAlign = "left";
            Row.appendChild(th);

            const td = document.createElement("td");
            td.innerHTML = `<a href='${proj.hostingLink}'>${proj.hostingLink}</a>`;
            th.style.width = "50%";
            th.style.textAlign = "left";
            Row.appendChild(td);

            links.appendChild(Row);
        }

        categoryDiv.appendChild(links);

        projects_section.appendChild(categoryDiv);
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

    // Convert certificates object to array
    const certificatesArray = Object.entries(certificateData);
    let currentIndex = 0;

    function createCertificateCard(certData, isActive = false) {
        const [cert, data] = certData;
        const card = document.createElement('div');
        card.classList.add('certificate-card');
        if (isActive) card.classList.add('active');

        const image = document.createElement('img');
        image.src = data.certificateLink;
        image.classList.add('certificate-image');
        
        image.onerror = () => {
            image.src = 'path/to/placeholder-image.jpg';
            console.error(`Failed to load certificate image for ${data.name}`);
        };

        const downloadIcon = document.createElement('div');
        downloadIcon.innerHTML = '⬇️';
        downloadIcon.classList.add('download-icon');
        downloadIcon.onclick = (e) => {
            e.stopPropagation();
            if (!data.certificateLink) {
                alert('Certificate not available for download');
                return;
            }
            
            try {
                const link = document.createElement('a');
                link.href = data.certificateLink;
                link.download = `${data.name}.jpeg`;
                link.href = data.certificateLink.replace("/images", "/pdfs").replace(".jpeg", ".pdf");
                link.download = `${data.name}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Download failed:', error);
                alert('Failed to download certificate');
            }
        };

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('certificate-info');
        
        const title = document.createElement('h3');
        title.textContent = data.name;

        const institution = document.createElement('p');
        institution.textContent = data.institution;

        infoDiv.appendChild(title);
        infoDiv.appendChild(institution);

        card.appendChild(image);
        card.appendChild(downloadIcon);
        card.appendChild(infoDiv);

        return card;
    }

    function updateDisplay() {
        certificationsSection.innerHTML = '';
        
        // Calculate previous and next indices with wrapping
        const prevIndex = (currentIndex - 1 + certificatesArray.length) % certificatesArray.length;
        const nextIndex = (currentIndex + 1) % certificatesArray.length;

        // Add previous certificate
        certificationsSection.appendChild(createCertificateCard(certificatesArray[prevIndex]));
        
        // Add current (active) certificate
        certificationsSection.appendChild(createCertificateCard(certificatesArray[currentIndex], true));
        
        // Add next certificate
        certificationsSection.appendChild(createCertificateCard(certificatesArray[nextIndex]));
    }

    // Initial display
    updateDisplay();

    // Event listeners for navigation
    leftBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + certificatesArray.length) % certificatesArray.length;
        updateDisplay();
    });

    rightBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % certificatesArray.length;
        updateDisplay();
    });
}
