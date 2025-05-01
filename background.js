chrome.storage.local.get(['videoAmpliado'], (result) => {
  if (result.videoAmpliado) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: monitorURLChange
      });
    });
  }
});

function monitorURLChange() {
  const applyClassChange = () => {
    const container = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
    if (container && container.classList.contains('lg:grid-cols-3')) {
      container.classList.replace('lg:grid-cols-3', 'lg:grid-cols-1');
      console.log('Clase aplicada correctamente');
    }

    // Aplicar el cambio de color de fondo
    const bgElements = document.querySelectorAll('.bg-gray-100');
    bgElements.forEach(element => {
      element.style.backgroundColor = 'rgb(37 37 37)';
    });
  };

  // Aplicar el cambio inmediatamente
  applyClassChange();

  // Observar cambios de URL
  let lastURL = location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== lastURL) {
      lastURL = location.href;
      console.log(`Cambio detectado a ${lastURL}`);
      applyClassChange();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Aplicar de nuevo cada 1 segundo por seguridad
  setInterval(() => {
    applyClassChange();
  }, 1000);
}

function handleVideoAmpliado(videoAmpliado) {
  const container = document.querySelector('.grid');
  
  if (!container) {
    console.log('No se encontró el contenedor');
    return;
  }

  if (videoAmpliado) {
    container.classList.replace('lg:grid-cols-3', 'lg:grid-cols-1');
    // Aplicar el cambio de color de fondo
    const bgElements = document.querySelectorAll('.bg-gray-100');
    bgElements.forEach(element => {
      element.style.backgroundColor = 'rgb(37 37 37)';
    });
    console.log('Video ampliado activado');
    startMonitoring();
  } else {
    container.classList.replace('lg:grid-cols-1', 'lg:grid-cols-3');
    // Restaurar el color de fondo original
    const bgElements = document.querySelectorAll('.bg-gray-100');
    bgElements.forEach(element => {
      element.style.backgroundColor = '';
    });
    console.log('Video ampliado desactivado');
    stopMonitoring();
  }
}

function startMonitoring() {
  if (window.urlObserver || window.classInterval) {
    console.log('El observer ya está activo');
    return;
  }

  // Observer para detectar cambios en la URL
  window.urlObserver = new MutationObserver(() => {
    chrome.storage.local.get('videoAmpliado', ({ videoAmpliado }) => {
      if (videoAmpliado) {
        const container = document.querySelector('.grid');
        if (container) {
          container.classList.replace('lg:grid-cols-3', 'lg:grid-cols-1');
          console.log('Se mantuvo el video ampliado');
        }
      }
    });
  });

  window.urlObserver.observe(document.body, { childList: true, subtree: true });

  // Interval para forzar la clase si se cambia
  window.classInterval = setInterval(() => {
    chrome.storage.local.get('videoAmpliado', ({ videoAmpliado }) => {
      const container = document.querySelector('.grid');
      if (videoAmpliado && container) {
        if (!container.classList.contains('lg:grid-cols-1')) {
          container.classList.replace('lg:grid-cols-3', 'lg:grid-cols-1');
          console.log('Clase corregida automáticamente');
        }
      }
    });
  }, 1000);
}

function stopMonitoring() {
  if (window.urlObserver) {
    window.urlObserver.disconnect();
    window.urlObserver = null;
    console.log('Observer detenido');
  }
  
  if (window.classInterval) {
    clearInterval(window.classInterval);
    window.classInterval = null;
    console.log('Interval detenido');
  }
}