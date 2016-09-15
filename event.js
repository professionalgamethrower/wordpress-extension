function injectedMethod(tab, method, callback) {
	chrome.tabs.executeScript(tab.id, {
		file : 'inject.js'
	}, function() {
		chrome.tabs.sendMessage(tab.id, {
			method : method
		}, callback);
	});
}

function getBodyText(tab) {
	injectedMethod(
			tab,
			'getBodyText',
			function(response) {
				var text = response.data;
				if (text && text.length) {
					// open new tab
					var search, line;

					// running this once here to get ride of [object Object]
					search = text.search('\n');
					text = text.substr(search + 1, text.length);

					var tempPage = "<html>";
					tempPage += "<link rel=\"stylesheet\" type=\"text/css\" href=\"mystyle.css\">";

					tempPage += "<script>";
					tempPage += "function changeSize(multiplier) {"
							+ "if (document.body.style.fontSize == \"\") {"
							+ "document.body.style.fontSize = \"1.0em\";"
							+ "}"
							+ "document.body.style.fontSize = parseFloat(document.body.style.fontSize) + (multiplier * 0.2) + \"em\";"
							+ "}";
					tempPage += "function changeBG(color) {"
							+ "document.body.style.backgroundColor = color;"
							+ " document.body.style.color = 'dimgray';" + "}";
					tempPage += "function changeNight() {"
							+ "document.body.style.backgroundColor = '#555555';"
							+ " document.body.style.color = 'white';" + "}";
					tempPage += "</script>";

					tempPage += "<body>";
					tempPage += "<div>";
					tempPage += "<button class=\"button\" onclick=\"changeBG('#ffffff')\">White</button>";
					tempPage += "<button class=\"button button5\" onclick=\"changeBG('#ffffbf')\">Beige</button>";
					tempPage += "<button class=\"button button2\" onclick=\"changeBG('#e9f4fc')\">Blue</button>";
					tempPage += "<button class=\"button button3\" onclick=\"changeBG('#f2fdec')\">Green</button>";
					tempPage += "<button class=\"button button4\" onclick=\"changeBG('#fdecfd')\">Pink</button>";
					tempPage += "<button class=\"button button6\" onclick=\"changeNight()\">Night</button>";
					tempPage += "</div>";
					tempPage += "<div>";
					tempPage += "<button class=\"button\" onclick=\"changeSize(-1)\">Smaller</button>";
					tempPage += "<button class=\"button\" onclick=\"changeSize(1)\">Larger</button>";
					tempPage += "</div>";

					for (var i = 0;; i++) {
						search = text.search('\n');
						line = text.substr(0, search);

						// only works for wordpress sites, since at the end of
						// every post is a bunch of share links
						var temp = -1;
						temp = line.search("Share this:");
						if (temp != -1)
							break;

						tempPage += ("<p id=" + "\"p" + i + "\"" + ">" + line
								+ '\n' + "</p>");

						text = text.substr(search + 1, text.length);

						if (text.length == 0)
							break;
					}
					tempPage += "</body>";
					tempPage += "</html>";

					var w = window.open('');
					w.document.write(tempPage);

				} else {
					alert('U done goofed! Your probably on the wrong site');
				}
				return true;
			});
}

// When the browser action is clicked, call the getBgColors function.
chrome.browserAction.onClicked.addListener(getBodyText);