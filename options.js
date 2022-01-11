// Saves options to chrome.storage
function save_options() {
    var startTime = document.getElementById('startTime').value;
    var endTime = document.getElementById('endTime').value;
    var music = document.getElementById('music').checked;
    var manual = document.getElementById('manual').checked;
    var randomness = document.getElementById('randomness').checked;
    chrome.storage.sync.set({
      startTime: startTime,
      endTime: endTime,
      music: music,
      manual: manual,
      randomness: randomness
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      window.close();
    });
  }

  // stored in chrome.storage.
  function restore_options() {
    chrome.storage.sync.get({
      startTime: '09:00',
      endTime: '16:35',
      music: false,
      manual: false,
      randomness: false
    }, function(items) {
      document.getElementById('startTime').value = items.startTime;
      document.getElementById('endTime').value = items.endTime;
      document.getElementById('music').checked = items.music;
      document.getElementById('manual').checked = items.manual;
      document.getElementById('randomness').checked = items.randomness;
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click', save_options);