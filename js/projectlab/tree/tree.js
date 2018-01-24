$(document).ready(function(){
    $('#jstree')

       .on('changed.jstree', function (e, data) {
             if(data.instance.get_type(data.selected[0]) == 'file'){
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


               $('#scriptName').val(currentNodeText);
               $('#scriptTreePath').val(parentPathStr);
             }
       })

       .on('create_node.jstree',function(e, data){
          if(data.instance.get_type(data.node) == 'file'){
              console.log('Inside create_node event.....node id is ' + data.node.id + "~" + data.instance.get_text(data.node) + "~" +data.instance.get_type(data.node));
              createScriptFolderOnServer(data.node.id, data.instance.get_text(data.node));
          }
       })

       .jstree({
            "core" : {
                       "check_callback" : true,
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

function addFolder() {
   var treeRef = $('#jstree').jstree(true);
   currentSelected = treeRef.get_selected();
   if (!currentSelected.length) {
     alert("Please select a folder before creating new folder");
     return false;
   }
   currentSelected = currentSelected[0];
   currentSelected = treeRef.create_node(currentSelected, {"type": "folder", "text": prompt("Enter folder name:")});

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
  currentSelected = treeRef.create_node(currentSelected, {"type": "file", "text": prompt("Enter script name:")});

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
       if(confirm("Are you sure to delete this?")){
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
           console.log("SUCCESS: tree data is added to the file");
       },
       error:function(){
           console.log("FAILED: failed to add tree data to the file");
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
          console.log("FAILED: Failed to fetch tree data!!!");
       }
   })
};

function createScriptFolderOnServer(scriptId, scriptName){
  var scriptDetails = {'id' : scriptId ,'name' : scriptName};
   $.ajax({
       type:'POST',
       url:'/api/createScriptFolder',
       data: scriptDetails,
       success:function(){
           console.log("SUCCESS: script folder is created on the server");
       },
       error:function(){
           console.log("FAILED: failed to create script folder on server");
       }
   });
};
