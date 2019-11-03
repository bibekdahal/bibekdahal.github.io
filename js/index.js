$(document).ready(() => {
  $('#projects .project').click((e) => {
    const projectId = $(e.currentTarget).data('id');
    $('#projects .details').removeClass('active');
    $(`#projects .details[data-id="${projectId}"]`).addClass('active');


    $('#projects .project').removeClass('active');
    $(`#projects .project[data-id="${projectId}"]`).addClass('active');
  });
});
