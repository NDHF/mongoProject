// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + 
    "<a href='http://www.theweek.com" + data[i].link + "'>theweek.com" + data[i].link + "</a></p>");
  }
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote' class='noteediting'>Save Note</button>");
      // A button to delete a note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='deletenote' class='noteediting'>Delete Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", ".noteediting", function() {
  // Grab the id associated with the article from the submit button
  let thisId = $(this).attr("data-id");
  let thisElementId = $(this).attr("id");
  let noteTitle;
  let noteBody;

  if (thisElementId === "savenote") {
    noteTitle = $("#titleinput").val();
    noteBody = $("#bodyinput").val();
  } else if (thisElementId === "deletenote") {
    noteTitle = "";
    noteBody = "";
  } else {
    console.error("Invalid ID");
    return;
  }

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: noteTitle,
      // Value taken from note textarea
      body: noteBody
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});