document.getElementById("defaultTab").click();

$(document).ready(function(){
  $("#steps-dropdown").click(function(){
      switch($('#steps-dropdown :selected').text()){
        case "GET method":
          addTemplateById("get-method");
          break;
        case "POST method":
          addTemplateById("post-method");
          break;
      }
      $(this).prop('selectedIndex', 0);
  });
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function addTemplateById(templateId){
  var temp = document.getElementById(templateId);
  var cloneTemplate = temp.content.cloneNode(true);
  document.getElementById("automation-content").appendChild(cloneTemplate);
}

function deleteStep(param){
  if(confirm("Are you sure you want to delete this step?")){
    param.parentNode.parentNode.removeChild(param.parentNode);
  }
}

function saveScript(){
  var stepsHtml = $("#automation-content").html();
  var scriptId = $("#scriptId").val();
  var stepsData = {'id' : scriptId ,'html' : stepsHtml};

  $.ajax({
      type:'POST',
      url:'/api/saveScriptToHtml',
      data: stepsData,
      success:function(){
          alert("Script details are save successfully!!!");
          console.log("SUCCESS: Script HTML data is added to the file");
      },
      error:function(){
          alert("There was problem in saving script details!!!");
          console.log("FAILED: failed to add script HTML data to the file");
      }
  });
}
