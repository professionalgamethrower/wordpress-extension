// This helps avoid conflicts in case we inject this script on the same page multiple times without reloading.
var injected = injected
		|| (function() {
			// An object that will contain the "methods" we can use from our event script.
			var methods = {};

			// This method will eventually return body text from the current page.
			methods.getBodyText = function() {
				// temp storage
				var text = {};
				// grabs all node on the current page
				var nodes = document.querySelectorAll('*');
				// varibles for later use
				var curNode, nodeText, i;
				var keep = false;

				// loop through all nodes of the page
				for (i = 0; i < nodes.length; i++) {
					// current node to be operated on
					curNode = nodes[i];
					// add node text to text
					if (curNode.id == "main") {
						keep = true;
					}
					else if (curNode.id == "comments") {
						break;
					}
					if(keep)
						// got all text from page
						text += (curNode.textContent + '\n');

				}
				//console.log('TEXT: \n' + text);
				return text;

			};

			// This tells the script to listen for messages from our extension.
			chrome.runtime.onMessage.addListener(function(request, sender,
					sendResponse) {
				var data = {};
				// If the method the extension has requested exists, call it and assign its response to data.
				if (methods.hasOwnProperty(request.method))
					data = methods[request.method]();
				// Send the response back to our extension.
				sendResponse({
					data : data
				});
				return true;
			});

			return true;
		})();