// Listen for messages from the popup script
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'buttonClicked') {
        sendConversationToPopup();
    }
});

function extractInnerHTML(messageId, authorRole) {
    // Query the div based on data-message-id and data-message-author-role
    var div = document.querySelector('div[data-message-author-role="' + authorRole + '"][data-message-id="' + messageId + '"]').querySelector('div');
    
    // Check if the div exists
    if (div) {
        // Extract the inner HTML of the div
        return div.innerHTML;
    } else {
        // Return null if the div doesn't exist
        return null;
    }
}

function appendNodesToArray(authorRole) {
  const nodeList = document.querySelectorAll('div[data-message-author-role="' + authorRole + '"]');
  const array = [];

  nodeList.forEach(node => {
    const messageId = node.getAttribute('data-message-id');
    const content = extractInnerHTML(messageId, authorRole);
    array.push(content);
  });

  return array;
}

function extractConversation() {

    const userContent = appendNodesToArray("user")
    const assistantContent = appendNodesToArray("assistant")

    // Define an object to store the data
    const conversation = [];

    // Ensure both arrays are of the same length
    const minLength = Math.min(userContent.length, assistantContent.length);

    // Iterate over the arrays and pair up the messages
    for (let i = 0; i < minLength; i++) {
        const userMessage = userContent[i];
        const assistantMessage = assistantContent[i];
        
        const newConversation = { 'you': userMessage, 'chatgpt': assistantMessage };
        conversation.push(newConversation);
    }

    return conversation
}

// Send message to the popup script with the conversation object
function sendConversationToPopup() {
    const conversation = extractConversation();
    if (conversation) {
        browser.runtime.sendMessage({ action: 'buttonClicked', conversation });
    }
}