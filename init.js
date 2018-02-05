load('api_gpio.js');
load('api_mqtt.js');
load('api_net.js');
load('api_sys.js');
load('api_timer.js');

let sta_topic = 'light/state';
let cmd_topic = 'light/command';
let lamp_pin = 5;
let sw_pin = 4;
let cmd = 'OFF';

let sw_on = function() {
    GPIO.write(lamp_pin, 0);
    cmd = 'ON';
    MQTT.pub(sta_topic, cmd, 1);
};

let sw_off = function() {
    GPIO.write(lamp_pin, 1);
    cmd = 'OFF';
    MQTT.pub(sta_topic, cmd, 1);

};


let toggle_light = function() {
    if (cmd === 'OFF') { sw_on(); } else { sw_off(); }
};


// Init

GPIO.set_mode(lamp_pin, GPIO.MODE_OUTPUT);

GPIO.set_button_handler(sw_pin, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 200, function() {
    toggle_light();
}, null);

MQTT.sub(cmd_topic, function(conn, topic, msg) {
    if (msg === 'OFF') { sw_off(); } else { sw_on(); }
}, null);