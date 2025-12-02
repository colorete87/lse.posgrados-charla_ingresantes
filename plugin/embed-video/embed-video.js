/**
 * reveal.js plugin for embedding videos
 * Supports YouTube, Vimeo, and other video platforms
 * This plugin only processes elements with data-video attributes
 * It does not modify existing iframes to avoid conflicts
 */
const RevealEmbedVideo = {
  id: 'embed-video',
  
  init: function( reveal ) {
    // Only process data-video attributes, don't touch existing iframes
    // This prevents conflicts with directly embedded YouTube iframes
    // The plugin is completely passive for existing iframes
    try {
      reveal.addEventListener( 'ready', function() {
        processVideoEmbeds( reveal );
      } );
      
      reveal.addEventListener( 'slidechanged', function( event ) {
        processVideoEmbeds( reveal, event.currentSlide );
      } );
    } catch( e ) {
      console.warn( 'RevealEmbedVideo: Error initializing plugin', e );
    }
  }
};

function processVideoEmbeds( reveal, slide ) {
  try {
    // If a specific slide is provided, only process that slide
    const slides = slide ? [ slide ] : reveal.getSlides();
    
    slides.forEach( function( slideElement ) {
      // ONLY process data-video attributes - do NOT touch existing iframes
      // This is critical to avoid breaking existing YouTube embeds
      // Using querySelectorAll with :not(:has()) may not work in all browsers,
      // so we manually check for existing iframes
      const videoElements = slideElement.querySelectorAll( '[data-video]' );
      videoElements.forEach( function( element ) {
        // Skip if element already has an iframe
        if ( element.querySelector( 'iframe' ) ) {
          return;
        }
        const videoUrl = element.getAttribute( 'data-video' );
        if ( videoUrl ) {
          const iframe = createVideoIframe( videoUrl );
          element.appendChild( iframe );
        }
      } );
    } );
  } catch( e ) {
    console.warn( 'RevealEmbedVideo: Error processing video embeds', e );
  }
}

function createVideoIframe( url ) {
  const iframe = document.createElement( 'iframe' );
  
  // Convert YouTube URLs to embed format
  if ( url.includes( 'youtube.com/watch' ) || url.includes( 'youtu.be' ) ) {
    const videoId = extractYouTubeId( url );
    if ( videoId ) {
      // Add necessary parameters to prevent error 153
      iframe.src = 'https://www.youtube.com/embed/' + videoId + '?enablejsapi=1&origin=' + window.location.origin;
    }
  } else if ( url.includes( 'vimeo.com' ) ) {
    const videoId = extractVimeoId( url );
    if ( videoId ) {
      iframe.src = 'https://player.vimeo.com/video/' + videoId;
    }
  } else {
    iframe.src = url;
  }
  
  iframe.setAttribute( 'frameborder', '0' );
  iframe.setAttribute( 'allowfullscreen', '' );
  iframe.setAttribute( 'allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' );
  iframe.style.cssText = 'width: 100%; height: 100%;';
  
  return iframe;
}

function extractYouTubeId( url ) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match( regExp );
  return ( match && match[2].length === 11 ) ? match[2] : null;
}

function extractVimeoId( url ) {
  const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
  const match = url.match( regExp );
  return match ? match[1] : null;
}

