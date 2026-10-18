/* Shared save logic for the Add / Edit recipe pages (replaces add-recipe.php / edit-recipe.php). */
window.RLRecipeForm = function (form, me, existing) {
  // Video file or URL, not both — same rule as the original pages
  var videoFileInput = form.querySelector('input[name="video_file"]');
  var videoURLInput = form.querySelector('input[name="video_url"]');
  videoFileInput.addEventListener('change', function () {
    if (videoFileInput.value !== '') { videoURLInput.value = ''; videoURLInput.disabled = true; }
    else { videoURLInput.disabled = false; }
  });
  videoURLInput.addEventListener('input', function () {
    if (videoURLInput.value !== '') { videoFileInput.value = ''; videoFileInput.disabled = true; }
    else { videoFileInput.disabled = false; }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var submit = form.querySelector('button[type=submit]');
    submit.disabled = true;

    var names = form.querySelectorAll('input[name="ingredient_name[]"]');
    var qtys = form.querySelectorAll('input[name="ingredient_qty[]"]');
    var ingredients = [];
    names.forEach(function (n, i) {
      var name = n.value.trim(), qty = (qtys[i] && qtys[i].value.trim()) || '';
      if (name !== '' && qty !== '') ingredients.push([name, qty]);
    });
    var steps = [];
    form.querySelectorAll('input[name="step[]"]').forEach(function (s) {
      if (s.value.trim() !== '') steps.push(s.value.trim());
    });

    var videoFile = videoFileInput.files[0];
    var videoUrl = videoURLInput.value.trim();
    var video;
    if (videoFile) video = 'upload:' + videoFile.name;
    else if (videoUrl) video = videoUrl;
    else if (existing && /^https?:/i.test(existing.videoFilePath || '')) video = ''; // URL removed
    else if (!existing) video = '';

    RL.readPhoto(form.elements['photo'].files[0], 900).then(function (photo) {
      var id = RL.saveRecipe(me.id, {
        name: form.elements['name'].value.trim(),
        categoryID: parseInt(form.elements['category'].value, 10),
        description: form.elements['description'].value.trim(),
        photo: photo || undefined,
        video: video,
        ingredients: ingredients,
        steps: steps
      }, existing && existing.id);
      if (!id) { submit.disabled = false; return; }
      var done = function () { location.href = 'my-recipes.html'; };
      if (videoFile) {
        RL.media.put('video_' + id, videoFile).then(done, function () {
          alert('The recipe was saved, but this browser could not store the video file.');
          done();
        });
      } else {
        done();
      }
    });
  });
};
