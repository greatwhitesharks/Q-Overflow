
// Use each to assign a copy of the voteAmount variable to EACH of the clickUp buttons.
$('.rating').each(function(){	
  var voteAmount = 0;

// Use this to ensure you're attaching the event within EACH of the buttons.
// Using the classname takes the button you've clicked and continues the number on.

$(this).find(".rating-up").click(function(){	

  voteAmount ++;
  $(this).siblings('.counter').text(voteAmount);

});


$(this).find(".rating-down").click(function(){	


  voteAmount --;
$(this).siblings('.counter').text(voteAmount);

});


}); // Ends the each();