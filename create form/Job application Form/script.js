/* Grab references to relevant DOM elements for interactivity */
const form = document.getElementById('job-application');         // main form
const resumeInput = document.getElementById('resume');          // resume file input
const photoInput = document.getElementById('photo');            // photo file input
const declaration = document.getElementById('declaration');     // declaration checkbox
const submitBtn = form.querySelector('button[type="submit"]'); // submit button
const cover = document.getElementById('cover');                 // cover letter textarea

/* Create small UI containers for file info & preview dynamically */
const resumeInfo = document.createElement('div');
resumeInfo.className = 'file-info';
resumeInfo.id = 'resume-info';
resumeInfo.textContent = ''; /* initially empty */

const photoPreview = document.createElement('img');
photoPreview.className = 'preview-img';
photoPreview.id = 'photo-preview';
photoPreview.style.display = 'none'; /* hidden until an image is selected */

/* Insert these nodes right after the corresponding inputs for visibility */
resumeInput.parentNode.insertBefore(resumeInfo, resumeInput.nextSibling);
photoInput.parentNode.insertBefore(photoPreview, photoInput.nextSibling);

/* Disable submit initially if declaration is not checked */
submitBtn.disabled = !declaration.checked;

/* Listen for changes on declaration checkbox to enable/disable submit dynamically */
declaration.addEventListener('change', function () {
  // if checkbox is checked, enable submit; otherwise disable
  submitBtn.disabled = !this.checked;
});

/* Show resume file name when user selects a file */
resumeInput.addEventListener('change', function () {
  const file = this.files && this.files[0];
  if (file) {
    // show filename and size in KB rounded to one decimal place
    const sizeKB = (file.size / 1024).toFixed(1);
    resumeInfo.textContent = `Selected: ${file.name} (${sizeKB} KB)`;
  } else {
    resumeInfo.textContent = '';
  }
});

/* Show photo preview when user selects an image */
photoInput.addEventListener('change', function () {
  const file = this.files && this.files[0];
  if (!file) {
    photoPreview.style.display = 'none';
    photoPreview.src = '';
    return;
  }

  // Only proceed for image files (basic check)
  if (!file.type.startsWith('image/')) {
    photoPreview.style.display = 'none';
    photoPreview.src = '';
    return;
  }

  // Create a temporary URL to show preview (does not upload)
  const url = URL.createObjectURL(file);
  photoPreview.src = url;
  photoPreview.style.display = 'block';

  // Release the object URL once image loads to free memory
  photoPreview.onload = () => {
    URL.revokeObjectURL(url);
  };
});

/* Live character count for cover letter (optional helper) */
const coverCounter = document.createElement('div');
coverCounter.className = 'file-info';
coverCounter.id = 'cover-counter';
cover.parentNode.insertBefore(coverCounter, cover.nextSibling);

const MAX_COVER = 1000; // suggested soft limit

coverCounter.textContent = `0 / ${MAX_COVER} characters`;

cover.addEventListener('input', function () {
  const len = this.value.length;
  coverCounter.textContent = `${len} / ${MAX_COVER} characters`;
  // Optional: visually warn when approaching limit
  if (len > MAX_COVER) {
    coverCounter.style.color = 'crimson';
  } else if (len > MAX_COVER * 0.8) {
    coverCounter.style.color = '#b45309'; // amber-ish when nearing limit
  } else {
    coverCounter.style.color = '';
  }
});

/* Form submit handling: basic validation + demo behavior
   For demo/GitHub Pages we prevent actual submission and show form data in console.
   If you have a backend endpoint, replace or remove e.preventDefault() and set form.action accordingly.
*/
form.addEventListener('submit', function (e) {
  // Let browser run its built-in validation first; if invalid, do nothing special
  if (!form.checkValidity()) {
    // If form is invalid, allow browser to display native validation messages
    return;
  }

  // Prevent default so demo doesn't actually submit and reload page
  e.preventDefault();

  // Collect form data into FormData object (works for files too)
  const data = new FormData(form);

  // Convert simple entries to an object for console logging (files left as filenames)
  const plain = {};
  for (const pair of data.entries()) {
    const key = pair[0];
    const value = pair[1];

    // For file inputs, value is a File object — show only filename in demo log
    if (value instanceof File) {
      plain[key] = value.name || '(no file)';
    } else {
      plain[key] = value;
    }
  }

  // Example: show form data in console (developer can send this via fetch to backend)
  console.log('Form submission (demo):', plain);

  // Friendly success message for demo users
  alert('Form validated and ready to submit! (Demo mode — check console for data.)');

  // If you want to actually submit to a server, uncomment the next line:
  // form.submit();
});

/* Optional utility: keyboard shortcut to focus on Full Name input (press Alt + 1) */
document.addEventListener('keydown', function (e) {
  if (e.altKey && e.key === '1') {
    const nameInput = document.getElementById('fullName');
    if (nameInput) {
      nameInput.focus();
      // prevent default browser actions for Alt+1 in some environments
      e.preventDefault();
    }
  }
});
