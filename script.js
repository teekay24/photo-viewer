// Parse CSV file and load photos
Papa.parse("./photos.csv", {
    download: true,
    header: true,
    complete: function (results) {
        const photos = results.data;
        const tags = new Set();

        // Extract unique tags and generate photo gallery
        photos.forEach(photo => {
            if (photo.tags) {
                photo.tags.split(",").forEach(tag => tags.add(tag.trim()));
            }
            createPhotoItem(photo);
        });

        // Generate checkboxes for tag filters
        createTagCheckboxes([...tags]);
    }
});

// Create a photo item in the gallery
function createPhotoItem(photo) {
    const gallery = document.getElementById("photo-gallery");
    const photoItem = document.createElement("div");
    photoItem.className = "photo-item";
    photoItem.dataset.tags = photo.tags;

    photoItem.innerHTML = `
        <img src="${photo.image}" alt="${photo.description}">
        <p>${photo.description}</p>
        <a href="${photo.link}" class="view-full-photo">View Full Photo</a>
    `;

    gallery.appendChild(photoItem);
}

// Create checkboxes for filtering tags
function createTagCheckboxes(tags) {
    const tagFilters = document.getElementById("tag-filters");

    tags.forEach(tag => {
        const label = document.createElement("label");
        label.className = "tag-checkbox";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = tag;
        checkbox.addEventListener("change", filterPhotos);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(tag));
        tagFilters.appendChild(label);
    });
}

// Filter photos based on selected tags
function filterPhotos() {
    const selectedTags = Array.from(
        document.querySelectorAll("#tag-filters input:checked")
    ).map(input => input.value);

    const photos = document.querySelectorAll(".photo-item");
    photos.forEach(photo => {
        const photoTags = photo.dataset.tags ? photo.dataset.tags.split(",") : [];
        if (selectedTags.length === 0 || selectedTags.some(tag => photoTags.includes(tag))) {
            photo.style.display = "block";
        } else {
            photo.style.display = "none";
        }
    });
}
