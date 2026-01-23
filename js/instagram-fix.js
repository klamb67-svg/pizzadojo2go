/**
 * Instagram In-App Browser Fix
 * Detects Instagram's in-app browser and prompts users to open in Safari/Chrome
 */

(function() {
  'use strict';

  // Detect Instagram's in-app browser
  function isInstagramBrowser() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Instagram's in-app browser user agents typically contain:
    // - "Instagram" 
    // - "FBAN" (Facebook App Name)
    // - "FBAV" (Facebook App Version)
    return /Instagram|FBAN|FBAV/i.test(userAgent);
  }

  // Create and show the warning banner
  function showInstagramWarning() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'instagram-warning-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      box-sizing: border-box;
    `;

    // Create warning box
    const warningBox = document.createElement('div');
    warningBox.style.cssText = `
      background: linear-gradient(135deg, rgba(93, 64, 55, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
      border: 3px solid #d4af37;
      border-radius: 12px;
      padding: 2.5rem;
      max-width: 500px;
      width: 100%;
      text-align: center;
      box-shadow: 0 8px 32px rgba(212, 175, 55, 0.3);
    `;

    // Create icon/emoji
    const icon = document.createElement('div');
    icon.style.cssText = `
      font-size: 4rem;
      margin-bottom: 1rem;
    `;
    icon.textContent = '⚠️';

    // Create heading
    const heading = document.createElement('h2');
    heading.style.cssText = `
      font-family: 'Bangers', cursive;
      font-size: 2rem;
      color: #d4af37;
      margin: 0 0 1rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
      letter-spacing: 0.05em;
    `;
    heading.textContent = 'Open in Browser';

    // Create message
    const message = document.createElement('p');
    message.style.cssText = `
      font-family: 'Varela Round', sans-serif;
      font-size: 1.1rem;
      color: #f5e6d3;
      margin: 0 0 1.5rem 0;
      line-height: 1.6;
      text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
    `;
    message.innerHTML = 'For the best experience, please open this site in <strong>Safari</strong> or <strong>Chrome</strong>.<br><br>Tap the menu (⋯) in the top right, then select "Open in Browser".';

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    `;

    // Create "Try Anyway" button (dismisses warning)
    const tryButton = document.createElement('button');
    tryButton.style.cssText = `
      padding: 0.9rem 2rem;
      font-family: 'Bangers', cursive;
      font-size: 1.2rem;
      color: #f5e6d3;
      background: rgba(212, 175, 55, 0.2);
      border: 2px solid #d4af37;
      border-radius: 0.4rem;
      cursor: pointer;
      transition: all 0.25s ease;
      letter-spacing: 0.05em;
      text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
      width: 100%;
      max-width: 300px;
    `;
    tryButton.textContent = 'Try Anyway';
    tryButton.onmouseover = function() {
      this.style.background = '#d4af37';
      this.style.color = '#5d4037';
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.4)';
    };
    tryButton.onmouseout = function() {
      this.style.background = 'rgba(212, 175, 55, 0.2)';
      this.style.color = '#f5e6d3';
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    };
    tryButton.onclick = function() {
      overlay.style.display = 'none';
      // Store dismissal in sessionStorage so it doesn't show again this session
      sessionStorage.setItem('instagram-warning-dismissed', 'true');
    };

    // Create "Copy Link" button
    const copyButton = document.createElement('button');
    copyButton.style.cssText = `
      padding: 0.9rem 2rem;
      font-family: 'Bangers', cursive;
      font-size: 1.2rem;
      color: #f5e6d3;
      background: rgba(212, 175, 55, 0.2);
      border: 2px solid #d4af37;
      border-radius: 0.4rem;
      cursor: pointer;
      transition: all 0.25s ease;
      letter-spacing: 0.05em;
      text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
      width: 100%;
      max-width: 300px;
    `;
    copyButton.textContent = 'Copy Link';
    copyButton.onmouseover = function() {
      this.style.background = '#d4af37';
      this.style.color = '#5d4037';
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.4)';
    };
    copyButton.onmouseout = function() {
      this.style.background = 'rgba(212, 175, 55, 0.2)';
      this.style.color = '#f5e6d3';
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    };
    copyButton.onclick = function() {
      navigator.clipboard.writeText(window.location.href).then(function() {
        copyButton.textContent = '✓ Copied!';
        setTimeout(function() {
          copyButton.textContent = 'Copy Link';
        }, 2000);
      }).catch(function() {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          copyButton.textContent = '✓ Copied!';
          setTimeout(function() {
            copyButton.textContent = 'Copy Link';
          }, 2000);
        } catch (err) {
          copyButton.textContent = 'Failed';
          setTimeout(function() {
            copyButton.textContent = 'Copy Link';
          }, 2000);
        }
        document.body.removeChild(textArea);
      });
    };

    // Assemble the warning
    buttonContainer.appendChild(tryButton);
    buttonContainer.appendChild(copyButton);
    warningBox.appendChild(icon);
    warningBox.appendChild(heading);
    warningBox.appendChild(message);
    warningBox.appendChild(buttonContainer);
    overlay.appendChild(warningBox);

    // Add to page
    document.body.appendChild(overlay);

    // Prevent body scroll when overlay is shown
    document.body.style.overflow = 'hidden';
  }

  // Check if warning was already dismissed this session
  if (isInstagramBrowser() && !sessionStorage.getItem('instagram-warning-dismissed')) {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showInstagramWarning);
    } else {
      showInstagramWarning();
    }
  }
})();
