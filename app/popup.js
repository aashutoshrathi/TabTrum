// function byAlphabeticalURLOrder(tab1, tab2) {
//     if (tab1.url < tab2.url) {
//       return -1;
//     } else if (tab1.url > tab2.url) {
//       return 1;
//     }
//     return 0;
//   }



// chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {

//     tabs.sort(byAlphabeticalURLOrder);
//     // chrome.tabs.move(tabs[0].id, {index: 0});

//     // for (let i = 0; i < tabs.length; i++) {
//     //   chrome.tabs.move(tabs[i].id, {index: i});
//     // }

//     //var newURL = "http://stackoverflow.com/";
//     //chrome.tabs.create({ url: newURL });

//     chrome.storage.local.set({'data' : [{'foo': 'hello', 'bar': 'hi'}, {'foo': 'it', 'bar': 'works'}]}, function() {
//         console.log('Settings saved');
//       });

//      // Read it using the storage API
//         chrome.storage.local.get(['data'], function(items) {
//             try {
//                 justdata = {'foo': 'it', 'bar': 'blah'};
//                 items.data.push(justdata);
//                 //document.write(items.data[2].bar);
//             }
//             catch(e) {
//                 document.write(e);
//             }
//           });    
     
//     // document.write(`<h3>The tabs you're on are:</h3>`);
//     // document.write('<ul>');
//     // for (let i = 0; i < tabs.length; i++) {
//     //   document.write(`<li>${tabs[i].title}</li>`);
//     // }
//     // document.write('</ul>');
//   });
loadData();


  var button = document.getElementById('snapshot_button');
  button.onclick = function() {
     
    try {
        chrome.storage.local.get(['data'], function(items) {
        var tab_data = items.data;
        
        if(tab_data) {
          chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
            var new_snapshot = {
              'title' : 'Snapshot ' + tab_data.length,
              'id' : 'id_' + tab_data.length,
              'tabs' : tabs
            }
  
            tab_data.push(new_snapshot);
            setData(tab_data); 
            update_panel(new_snapshot);
            //console.log(new_snapshot);
          });
        }
        else {
          var init_data = [];
          chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
            var new_snapshot = {
              'title' : 'Snapshot ' + init_data.length,
              'id' : 'id_' + init_data.length,
              'tabs' : tabs
            }

            init_data.push(new_snapshot);
            setData(init_data); 
            update_panel(new_snapshot);
          });
        }
      });
    }
    catch(e) {
      var init_data = [];
      chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
        var new_snapshot = {
          'title' : 'Snapshot ' + init_data.length,
          'id' : 'id_' + init_data.length,
          'tabs' : tabs
        }

        init_data.push(new_snapshot);
        setData(init_data); 
        update_panel(new_snapshot);
      });
    } 

    update_panel();
  };




  function loadData() {
    var render_home = '';

    try {
      chrome.storage.local.get(['data'], function(items) {
        var render_data = items.data;

        if(render_data) {
          for(var i=0; i < render_data.length; i++) {
            render_home += '<div class="snapshot_tab" id="snapshot_tab_'+ render_data[i].id +'"> \
                            <h5 class="snapshot_title">'+ render_data[i].title +'</h5> \
                            <button class="snapshot_delete" id="snapshot_delete_'+render_data[i].id +'">x</button> \
                            <button class="snapshot_launch" id="snapshot_launch_'+ render_data[i].id +'">Launch Tabs</button> \
                            </div>';
          }

          document.getElementById('snapshot_list').innerHTML = render_home;
        }
        else {
          var data_initialize = [];
          setData(data_initialize);
        }
        
      });
    }
    catch(e) {
      console.log("Error : "+e);

      var data_initialize = [];
      setData(data_initialize);
    } 
  }


  function setData(data_update) {
    chrome.storage.local.set({'data' : data_update}, function() {
      console.log('Settings saved');
    });
  }

  


  function update_panel(data_snapshot) {
      var render_update = '';
      render_update = '<div class="snapshot_tab" id="snapshot_tab_'+ data_snapshot.id +'"> \
                       <h5 class="snapshot_title">'+ data_snapshot.title +'</h5> \
                       <button class="snapshot_delete" id="snapshot_delete_'+ data_snapshot.id +'">x</button> \
                       <button class="snapshot_launch" id="snapshot_launch_'+ data_snapshot.id +'">Launch Tabs</button> \
                       </div>';
      
      document.getElementById('snapshot_list').innerHTML += render_update;
  }



function clickLaunch(snapshot_index) {
    chrome.storage.local.get(['data'], function(items) {
      var index = snapshot_index;

      tabs_to_launch = items.data[index].tabs;
      for(var i=0; i < tabs_to_launch.length; i++) {
        var launch_url = tabs_to_launch[i].url;
        chrome.tabs.create({ url: launch_url });
      }
  
    });
}

function clickDelete(snapshot_delete) {
  chrome.storage.local.get(['data'], function(items) {
    var index = snapshot_delete;

    if(items.data[index].id = index)
      items.data.splice(index,1)

    setData(items.data);
  });
}


document.addEventListener('click', function (event) {

  var snapshot_index = event.target.id.split('_')[3];
  var action = event.target.id.split('_')[1];

  if(action == 'delete')
    clickDelete(snapshot_index);
  else
    clickLaunch(snapshot_index);

}, false);
 
