
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('downloadButton').addEventListener('click', function () {
        browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
            // Send a message to content.js when the button is clicked
            browser.tabs.sendMessage(tabs[0].id, { action: 'buttonClicked' });
        });
    });
});

browser.runtime.onMessage.addListener(function (message) {
    if (message.action === 'buttonClicked') {
        downloadConversationAsJSON(message.conversation);
    }
});

function setDate() {
    // Create a new Date object
    const currentDate = new Date();

    // Get the individual components of the date
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Month is zero-based
    const day = ('0' + currentDate.getDate()).slice(-2);
    const hours = ('0' + currentDate.getHours()).slice(-2);
    const minutes = ('0' + currentDate.getMinutes()).slice(-2);

    // Format the date using template literal
    const formattedDate = `${year}-${month}-${day}-${hours}-${minutes}`;

    return formattedDate; // Output the formatted date

}

function downloadConversationAsJSON(conversation) {
    // Convert the conversation object to JSON
    const conversationJSON = JSON.stringify(conversation, null, 2);

    // Create a Blob containing the JSON data
    const blob = new Blob([conversationJSON], { type: 'application/json' });

    // Create a temporary anchor element to download the JSON file
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `conversation-${setDate()}.json`;

    // Append the anchor to the body and trigger a click event to start the download
    document.body.appendChild(a);
    a.click();

    // Cleanup: remove the temporary anchor element
    document.body.removeChild(a);
}
