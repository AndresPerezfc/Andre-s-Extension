document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('toggleSwitch');
  
    // Leer el estado guardado y actualizar el switch
    chrome.storage.local.get(['videoAmpliado'], function (result) {
      toggleSwitch.checked = result.videoAmpliado || false;
    });
  
    // Escuchar el cambio del switch y guardar el nuevo estado
    toggleSwitch.addEventListener('change', function () {
      const isChecked = toggleSwitch.checked;
      chrome.storage.local.set({ videoAmpliado: isChecked });
  
      // Enviar un mensaje al contenido de la página para aplicar el cambio
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: applyClassChange,
          args: [isChecked]
        });
      });
    });
  });
  
  // Función que aplica el cambio de clase
  function applyClassChange(isChecked) {
    const container = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
    if (container) {
      if (isChecked) {
        container.classList.replace('lg:grid-cols-3', 'lg:grid-cols-1');
      } else {
        container.classList.replace('lg:grid-cols-1', 'lg:grid-cols-3');
      }
    }
  }


  document.getElementById('toggleSwitch').addEventListener('change', (e) => {
    const videoAmpliado = e.target.checked;
  
    chrome.storage.local.set({ videoAmpliado }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: handleVideoAmpliado,
          args: [videoAmpliado],
        });
      });
    });
  });