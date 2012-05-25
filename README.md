jQueryUI wpprogress widget
===================

Infinite progress bar based on Windows Phone 7.5 progress bar


How to use it
----------

1. Include jQuery and jQueryUI scripts
2. Include "jquery-ui-wpprogress.js"
3. Enable the widget with $(selector).wpprogress()
4. Start the animation with $(selector).wpprogress("start")
5. Stop the animation with $(selector).wpprogress("stop")

See "example.html" for a complete example.


Options
----------

<table>
	<tr>
		<th>Option</th>
		<th>Type</th>
		<th>Default</th>
		<th>Description</th>
	</tr>
	
	<tr>
		<td>bubbleBackgroundColor</td>
		<td>String</td>
		<td>"#00f"</td>
		<td>The background color to use for the bubbles</td>
	</tr>
	
	<tr>
		<td>enableDebug</td>
		<td>Boolean</td>
		<td>false</td>
		<td>Whether to enable debugging features</td>
	</tr>
</table>


Dependencies
----------
* jQuery 1.7.2
* jQueryUI 1.8.20
	* Core
	* Widget
	* Effects Core

