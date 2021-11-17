const form = $("#movie-form");
const movies = $("#movies");
const titleInput = $("#movie-title");

form.on("submit", function(event) {
    event.preventDefault();
    const title = titleInput.val();
    const starRating = $("#star-rating input[type='radio']:checked").val();

    if(title === "" || starRating === undefined) {
        // Invalid input
        alert("You must enter both a movie title and a rating!");
    } else {
        // Clearing the form
        titleInput.val("");
        $("#star-rating input[type='radio']").prop("checked", false);

        // Adding an element to the DOM for the movie
        const newDiv = $("<div>");
        newDiv.addClass("movie");
        newDiv.data("rating", starRating);
        
        const titleH2 = $("<h2>");
        titleH2.text(title);
        newDiv.append(titleH2);

        const ratingP = $("<p>");
        ratingP.addClass("rating");
        ratingP.text("★".repeat(starRating));
        newDiv.append(ratingP);

        const removeBtn = $("<button>");
        removeBtn.addClass("remove-button");
        removeBtn.text("Remove This Rating");
        removeBtn.on("click", function() {
            newDiv.remove();
        });
        newDiv.append(removeBtn);

        newDiv.appendTo(movies);
    }
})