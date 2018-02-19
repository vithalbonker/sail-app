$(document).ready(function(){
    $('#jstree')

       .on('changed.jstree', function (e, data) {
             if(data.instance.get_type(data.selected[0]) == 'file'){

                 $('#script_pane').show();
                 document.getElementById("defaultTab").click();

                 currentNodeText = data.instance.get_node(data.selected[0]).text;
                 parentPathStr = getNodeParentHierarchy(data);

                 $('#scriptId').val(data.selected[0]);
                 $('#scriptName').val(currentNodeText);
                 $('#scriptTreePath').val(parentPathStr);

                 getScriptHtmlDataFromServer();
             }else{
               $('#script_pane').hide();
             }
       })

       .on('create_node.jstree',function(e, data){
            if(data.instance.get_type(data.node) == 'file'){
              console.log('Inside create_node event.....node id is ' + data.node.id + "~" + data.instance.get_text(data.node) + "~" + data.instance.get_type(data.node));
              createScriptFolderOnServer(data.node.id, data.instance.get_text(data.node));
            }

            postTreeDataToServer();
       })

       .on('rename_node.jstree',function(e, data){
            if(data.instance.get_type(data.node) == 'file'){
              console.log('Inside rename_node event.....node id is ' + data.node.id + "~" + data.instance.get_text(data.node) + "~" + data.instance.get_type(data.node));
              renameScriptFolderOnServer(data.node.id, data.instance.get_text(data.node));
            }

            postTreeDataToServer();
       })

       .on('delete_node.jstree',function(e, data){
            if(data.instance.get_type(data.node) == 'file'){
              console.log('Inside delete_node event.....node id is ' + data.node.id + "~" + data.instance.get_text(data.node) + "~" + data.instance.get_type(data.node));
              deleteScriptFolderOnServer(data.node.id, data.instance.get_text(data.node));
            }

            $('#script_pane').hide();
            postTreeDataToServer();
       })

       .jstree({
            "core" : {
                       "check_callback" : true,
                       "animation" : 0,
                       'data' : {
                                   'url' : '/api/tree',
                                   'data' : function (node) {
                                       return { 'id' : node.id };
                                   }
                                }
                      },
            "types" : {
                         "#" : { "max_children" : 100, "max_depth" : 10, "valid_children" : ["root"] },
                         "root" : { "icon" : "/public/images/folder-16-16.png", "valid_children" : ["folder"] , "selected": false},
                         "folder" : { "icon" : "/public/images/folder-16-16.png", "valid_children" : ["folder","file"] },
                         "file" : { "icon" : "/public/images/file-16-16.ico", "valid_children" : [] }
                       },
            "plugins" : [ "changed", "dnd", "sort", "state", "unique", "types" ]
       });
});

function getNodeParentHierarchy(data){
    selectedNode = data.instance.get_node(data.selected[0]).id;
    currentNodeText = data.instance.get_node(data.selected[0]).text;
    currentNode = selectedNode;
    parentPath = [];
    while(true){
        parentNodeId = data.instance.get_parent(currentNode);
        if(parentNodeId == '#'){
          break;
        }
        parentText = data.instance.get_node(parentNodeId).text;
        parentPath.push(parentText);
        currentNode = parentNodeId;
    }

    parentPath = parentPath.reverse();
    parentPathStr = "";
    for(var i = 0; i < parentPath.length;i++){
      parentPathStr += parentPath[i] + String.fromCharCode(92);
    }

    return parentPathStr;
};

function getValidNodeName(nodeType){
    var validName = false;
    var name;
    while(!validName){
        name = prompt('Enter ' + nodeType + ' name:');
        name = name.replace(/[^a-z0-9]/gi, '');

        if(name.length == 0){
          alert('Enter valid ' + nodeType + ' name using alphabets and numbers only!!!');
        }
        else{
          validName = true;
        }
    }

    return name;
}

function addFolder() {
   var treeRef = $('#jstree').jstree(true);
   currentSelected = treeRef.get_selected();
   if (!currentSelected.length) {
     alert("Please select a folder before creating new folder");
     return false;
   }
   currentSelected = currentSelected[0];
   currentSelected = treeRef.create_node(currentSelected, {"type": "folder","text": getValidNodeName('folder')});

   if (currentSelected) {
     treeRef.edit(currentSelected);
   }

   postTreeDataToServer();
};

function addScript() {
    var treeRef = $('#jstree').jstree(true);
    currentSelected = treeRef.get_selected();
    if (!currentSelected.length) {
      alert("Please select a folder before creating new script");
      return false;
    }
    currentSelected = currentSelected[0];
    currentSelected = treeRef.create_node(currentSelected, {"type": "file","text": getValidNodeName('script')});

    if (currentSelected) {
      treeRef.edit(currentSelected);
    }

    postTreeDataToServer();
};

function renameNode(){
   var treeRef = $('#jstree').jstree(true);
   currentSelected = treeRef.get_selected();
   if (!currentSelected.length) {
      alert("Please select a folder before renaming");
      return false;
   }
   if(currentSelected == "root"){
     alert("Root folder cannot be renamed!!!");
   }else{
     currentSelected = currentSelected[0];
     treeRef.edit(currentSelected);
     postTreeDataToServer();
   }
};

function deleteNode() {
   var treeRef = $('#jstree').jstree(true);
   currentSelected = treeRef.get_selected();
   if (!currentSelected.length) {
     alert("Please select a folder before deleting");
     return false;
   }
   else{
     if(currentSelected == "root"){
       alert("Root folder cannot be deleted!!!");
     }
     else{
         if(confirm("Are you sure to delete this?\n\nTHIS ACTION CANNOT BE UNDONE!!!")){
             treeRef.delete_node(currentSelected);
             postTreeDataToServer();
         }
     }
   }
};

//This is implementation of "jquery AJAX POST request"
function postTreeDataToServer(){
   var treeRef = $('#jstree').jstree(true);
   rootJson = treeRef.get_json(null, { "flat" : true });
   $.ajax({
       type:'POST',
       url:'/api/tree',
       data: "[" + JSON.stringify(rootJson) + "]",
       success:function(){
           console.log("SUCCESS: Tree data is added to the file");
       },
       error:function(){
           console.log("FAILED: Unsuccessful in adding tree data to the file");
       }
   });
};

//below function is not used. This is implementation of "jquery AJAX GET request"
function getTreeDataFromServer(){
   $.ajax({
       type:'GET',
       url: '/api/tree',
       success: function(data){
          console.log("SUCCESS: Tree data is fetched successfully!!!");
          console.log(data);
       },
       error: function(){
          console.log("FAILED: Unsuccessful in fetching tree data!!!");
       }
   })
};

function createScriptFolderOnServer(scriptId, scriptName){
   var scriptDetails = {'id' : scriptId ,'name' : scriptName};
   $.ajax({
       type:'POST',
       url:'/api/tree/createScriptFolder',
       data: scriptDetails,
       success:function(){
           console.log("SUCCESS: script folder is created on the server");
       },
       error:function(){
           console.log("FAILED: failed to create script folder on server");
       }
   });
};

function renameScriptFolderOnServer(scriptId, newScriptName){
  var scriptDetails = {'id' : scriptId ,'name' : newScriptName};
  $.ajax({
      type:'POST',
      url:'/api/tree/renameScriptFolder',
      data: scriptDetails,
      success:function(){
          console.log("SUCCESS: script folder is renamed on the server");
      },
      error:function(){
          console.log("FAILED: failed to rename script folder on server");
      }
  });
};

function deleteScriptFolderOnServer(scriptId, scriptName){
  var scriptDetails = {'id' : scriptId ,'name' : scriptName};
  $.ajax({
      type:'POST',
      url:'/api/tree/deleteScriptFolder',
      data: scriptDetails,
      success:function(){
          console.log("SUCCESS: script folder is deleted on the server");
      },
      error:function(){
          console.log("FAILED: failed to delete script folder on server");
      }
  });
};

// var resize_el = document.getElementById("resize");
//
// function treeResize(){
//     var m_pos;
//     resize_el.addEventListener("mousedown", function(e){
//       m_pos = e.x;
//       document.addEventListener("mousemove", resize, false);
//     }, false);
//     document.addEventListener("mouseup", function(){
//       document.removeEventListener("mousemove", resize, false);
//     }, false);
// }
//
// function resize(e){
//   var parent = resize_el.parentNode;
//   var dx = m_pos - e.x;
//   m_pos = e.x;
//   parent.style.width = (parseInt(getComputedStyle(parent, '').width) + dx) + "px";
// }

function getScriptHtmlDataFromServer(){
  var scriptId = { 'id' : $("#scriptId").val() };

  //This is the AJAX GET request for fetching the HTML content
  $.ajax({
      type:'GET',
      url: '/api/getScriptHtml',
      data: scriptId,
      success: function(data){
         console.log("SUCCESS: Script HTML data is fetched successfully!!!");
         if(data.paramsHtml.length > 0){
            $("#params").html(data.paramsHtml);
         }

         if(data.automationHtml.length > 0){
            $("#automation-content").html(data.automationHtml);
         }

         //$("#Testdata").html(data.testdataHtml);
         getScriptDataFromServer();
      },
      error: function(){
         console.log("FAILED: Failed to fetch script HTML data!!!");
      }
  });
}

function getScriptDataFromServer(){
  var scriptId = { 'id' : $("#scriptId").val() };

  //This is the AJAX GET request for fetching the user entered data in the params
  $.ajax({
      type:'GET',
      url: '/api/getParamsUserEnteredData',
      data: scriptId,
      success: function(paramsData){
         console.log("SUCCESS: Params user entered data is fetched successfully!!!");
         populateParamsUserEnteredData(paramsData);
      },
      error: function(){
         console.log("FAILED: Failed to fetch params user entered data!!!");
      }
  });

  //This is the AJAX GET request for fetching the user entered data in the script
  $.ajax({
      type:'GET',
      url: '/api/getAutomationUserEnteredData',
      data: scriptId,
      success: function(scriptData){
         console.log("SUCCESS: Automation user entered data is fetched successfully!!!");
         populateAutomationUserEnteredData(scriptData);
      },
      error: function(){
         console.log("FAILED: Failed to fetch automation user entered data!!!");
      }
  });

  $.ajax({
      type:'GET',
      url: '/api/getTestDataUserEnteredData',
      data: scriptId,
      success: function(testdata){
         console.log("SUCCESS: Test data is fetched successfully!!!");
         document.getElementById('testdata-textarea').value = testdata;
      },
      error: function(){
         console.log("FAILED: Failed to fetch test data!!!");
      }
  });
}

function populateAutomationUserEnteredData(scriptJsonData){
  var stepsDiv = document.getElementsByClassName('step');
  $("#manual-tc tbody").children().remove();

  if(scriptJsonData.length > 0){
    var parsedJsonData = JSON.parse(scriptJsonData);

    for(var i = 0;i < stepsDiv.length;i++){

        switch(parsedJsonData["step" + (i + 1)].stepName){
            case "HTTP Method":
                 stepsDiv[i].getElementsByClassName('http-method-dropdown')[0].value = parsedJsonData["step" + (i + 1)].methodName;
                 break;
            case "Verify Status Code":
                 stepsDiv[i].getElementsByClassName('statusCode')[0].value = parsedJsonData["step" + (i + 1)].statusCode;
                 break;
            case "Verify Response Content Type":                   
                 stepsDiv[i].getElementsByClassName('expected-content-type-dropdown')[0].value = parsedJsonData["step" + (i + 1)].contentType;
                 break;
        }

        if(parsedJsonData["step" + (i + 1)].manual.stepDesc){
          $('#manual-tc').append('<tr><td>' + (i + 1) + '</td><td>' + parsedJsonData["step" + (i + 1)].manual.stepDesc + '</td><td>' + parsedJsonData["step" + (i + 1)].manual.expectedResult + '</td></tr>');
        }
    }
  }
}

function populateParamsUserEnteredData(paramJsonData){

  if(paramJsonData.length > 0){
    var parsedParamJsonData = JSON.parse(paramJsonData);
    var paramTypes = document.getElementsByClassName('params-dropdown');
    var paramNames = document.getElementsByClassName('param-name');

    for(var i = 0;i < Object.keys(parsedParamJsonData).length;i++){
      paramTypes[i].options[paramTypes[i].selectedIndex].text = JSON.parse(parsedParamJsonData[i]).type;
      paramNames[i].value = JSON.parse(parsedParamJsonData[i]).name;
    }
  }
}
