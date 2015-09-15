/**
 * Created by paulcook on 24/08/15.
 */
function writeScript(src) {
    document.write('<scr' + 'ipt src="' + src + '" onload="logEvent(\'write script\')()"></scr' + 'ipt>');
}
writeScript('blank.js?delay=2000&sync2&recursive');
