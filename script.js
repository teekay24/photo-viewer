// Load and parse CSV
document.addEventListener('DOMContentLoaded', () => {
    const tagSelect = document.getElementById('tag-select');
    const photoGallery = document.getElementById('photo-gallery');

function displayPhotos(photos) {
    const photoGallery = document.getElementById('photo-gallery');
    photoGallery.innerHTML = ''; // Clear the gallery

    // Display each photo
    photos.forEach(photo => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';

        // Construct the local file path by appending .jpg to the Photo_ID
        const photoPath = `./photos/${photo.Photo_ID}.jpg`;

        photoItem.innerHTML = `
            <img src="${photoPath}" alt="${photo.Title}">
            <p>${photo.Title}</p>
            <a href="${photoPath}" target="_blank">View Full Photo</a>
        `;
        photoGallery.appendChild(photoItem);
    });
}


    function populateTags(photos) {
        const tagSelect = document.getElementById('tag-select');
        const tagsSet = new Set();

        // Collect all unique tags from the photos
        photos.forEach(photo => {
            const tags = (photo.Tags || '').replace(/[()]/g, '').split('/');
            tags.forEach(tag => tagsSet.add(tag.trim()));
        });

        // Add default "All Tags" option
        const allOption = document.createElement('option');
        allOption.value = '';
        allOption.textContent = 'All Tags';
        tagSelect.appendChild(allOption);

        // Add each tag to the dropdown
        Array.from(tagsSet).sort().forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagSelect.appendChild(option);
        });
    }

    // Load CSV file
    Papa.parse('./photos.csv', {
        download: true,
        header: true,
        complete: function(results) {
            const photos = results.data;
            populateTags(photos);
            displayPhotos(photos);

            // Dropdown change event
            tagSelect.addEventListener('change', () => {
                const selectedTag = tagSelect.value;

                // Filter photos based on whether the selected tag is included
                const filteredPhotos = selectedTag
                    ? photos.filter(photo => {
                          // Remove parentheses and check if the tag exists
                          const tags = (photo.Tags || '').replace(/[()]/g, '').split('/');
                          return tags.map(tag => tag.trim()).includes(selectedTag);
                      })
                    : photos; // If no tag selected, show all photos

                displayPhotos(filteredPhotos);
            });
        }
    });
});
