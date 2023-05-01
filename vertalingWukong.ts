/**
* Functions to WuKong multifunctional expansion board by ELECFREAKS Co.,Ltd.
*/
//% color=#ff7f24  icon="\uf0c2" block="wuKong" blockId="wuKong"
//% groups=['Groene en grijze servomotor', 'Lampjes', 'Rode en gele dc-motor']
namespace wuKong {
    const board_address = 0x10
    /**
    * LightMode
    */
    export enum LightMode {
        //% block="GOLVEN"
        BREATH,
        //% block="UIT"
        OFF
    }
    /**
    * MotorList
    */
    export enum MotorList {
        //% block="M1"
        M1,
        //% block="M2"
        M2
    }
    /**
    * ServoList
    */
    export enum ServoList {
        //% block="S0" enumval=0
        S0,
        //% block="S1" enumval=1
        S1,
        //% block="S2" enumval=2
        S2,
        //% block="S3" enumval=3
        S3,
        //% block="S4" enumval=4
        S4,
        //% block="S5" enumval=5
        S5,
        //% block="S6" enumval=6
        S6,
        //% block="S7" enumval=7
        S7
    }
    /**
    * ServoTypeList
    */
    export enum ServoTypeList {
        //% block="270°"
        _270,
        //% block="180°"
        _180,
        //% block="360°" 
        _360
    }

    

    /*
     * TODO: Setting the angle of a servo motor. 
     * @param servo A servo in the ServoList , eg: ServoList.S1
     * @param angel Angle of servo motor , eg: 90
     */
    //% weight=100
    //% blockId=setServoAngle block="Zet %servoType servo %servo op hoek van %angle graden"
    //% hoek.min=0 hoek.max=270
    //% group="Groene en grijze servomotor"
    export function setServoAngle(servoType: ServoTypeList, servo: ServoList, angle: number): void {
        let buf = pins.createBuffer(4);
        if (servo == 0) {
            buf[0] = 0x03;
        }
        if (servo == 1) {
            buf[0] = 0x04;
        }
        if (servo == 2) {
            buf[0] = 0x05;
        }
        if (servo == 3) {
            buf[0] = 0x06;
        }
        if (servo == 4) {
            buf[0] = 0x07;
        }
        if (servo == 5) {
            buf[0] = 0x08;
        }
        if (servo == 6) {
            buf[0] = 0x09;
        }
        if (servo == 7) {
            buf[0] = 0x10;
        }

        switch (servoType) {
            case ServoTypeList._180:
                angle = Math.map(angle, 0, 180, 0, 180)
                break
            case ServoTypeList._270:
                angle = Math.map(angle, 0, 270, 0, 180)
                break
            case ServoTypeList._360:
                angle = Math.map(angle, 0, 360, 0, 180)
                break
        }

        buf[1] = angle;
        buf[2] = 0;
        buf[3] = 0;
        pins.i2cWriteBuffer(board_address, buf);
    }

     

    /*
     * TODO: Setting the speed of a servo motor. 
     * @param servo A servo in the ServoList , eg: ServoList.S1
     * @param angel Angle of servo motor , eg: 100
     */
    //% weight=95
    //% blockId=setServoSpeed block="Laat servomotor %servo draaien met snelheid %speed\\%"
    //% speed.min=-100 speed.max=100
    //% group="Groene en grijze servomotor"
    export function setServoSpeed(servo: ServoList, speed: number): void {
        speed = Math.map(speed, -100, 100, 0, 180)
        setServoAngle(ServoTypeList._180, servo, speed)
    }

    /**
     * TODO: Set the on-board LED display mode. 
     * @param mode breath or off , eg: LightMode.BREATH
     */
    //% weight=75
    //% blockId="setLightMode" block="Stel wit licht in op %mode"
    //% group="Lampjes"
    export function setLightMode(mode: LightMode): void {
        let buff = pins.createBuffer(4);
        switch (mode) {
            case LightMode.BREATH:
                buff[0] = 0x11;
                buff[1] = 0x00;
                buff[2] = 0;
                buff[3] = 0;
                pins.i2cWriteBuffer(board_address, buff);
                buff[0] = 0x12;
                buff[1] = 150;
                basic.pause(100);
                pins.i2cWriteBuffer(board_address, buff);
                break;
            case LightMode.OFF:
                buff[0] = 0x12;
                buff[1] = 0;
                buff[2] = 0;
                buff[3] = 0;
                pins.i2cWriteBuffer(board_address, buff);
                buff[0] = 0x11;
                buff[1] = 160;
                basic.pause(100);
                pins.i2cWriteBuffer(board_address, buff);
                break;
            default:
                break;
        }
    }



    /**
    * TODO: Set the brightness of on-board LED lamp.
    * @param light brightness, eg: 100
    */
    //% weight=70
    //% blockId=lightIntensity block="Stel lichtintensiteit in op %light"
    //% light.min=0 light.max=100
    //% group="Lampjes"
    export function lightIntensity(light: number): void {
        let buff = pins.createBuffer(4);
        buff[0] = 0x12;
        buff[1] = light;
        buff[2] = 0;
        buff[3] = 0;
        pins.i2cWriteBuffer(board_address, buff);
        basic.pause(100);
        buff[0] = 0x11;
        buff[1] = 160;
        pins.i2cWriteBuffer(board_address, buff);
    }


    /**
     * TODO: Set the speed of M1 or M2 motor. 
     * @param motor M1 or M2 motor , eg: MotorList.M1
     * @param speed motor speed, eg: 100
     */
    //% weight=65
    //% blockId=setMotorSpeed block="Laat dc-motor %motor draaien met snelheid %speed"
    //% speed.min=-100 speed.max=100
    //% group="Rode en gele dc-motor"
    export function setMotorSpeed(motor: MotorList, speed: number): void {
        let buf = pins.createBuffer(4);
        switch (motor) {
            case MotorList.M1:
                buf[0] = 0x01;
                buf[1] = 0x01;
                if (speed < 0) {
                    buf[1] = 0x02;
                    speed = speed * -1
                }
                buf[2] = speed;
                buf[3] = 0;
                pins.i2cWriteBuffer(board_address, buf);
                break;
            case MotorList.M2:
                buf[0] = 0x02;
                buf[1] = 0x01;
                if (speed < 0) {
                    buf[1] = 0x02;
                    speed = speed * -1
                }
                buf[2] = speed;
                buf[3] = 0;
                pins.i2cWriteBuffer(board_address, buf);
                break;
            default:
                break;
        }
    }
    /*
     * TODO: Set both of M1 and M2 motors speed. 
     * @param m1speed M1 motor speed , eg: 100
     * @param m2speed M2 motor speed, eg: -100
     */
    //% weight=64
    //% blockId=setAllMotor block="Dc-motor M1 snelheid %m1speed dc-motor M2 snelheid %m2speed"
    //% m1speed.min=-100 m1speed.max=100
    //% m2speed.min=-100 m2speed.max=100
    //% group="Rode en gele dc-motor"
    export function setAllMotor(m1speed: number, m2speed: number): void {
        setMotorSpeed(MotorList.M1, m1speed)
        setMotorSpeed(MotorList.M2, m2speed)
    }

    /*
     * TODO: Stop one of the motors. 
     * @param motor A motor in the MotorList , eg: MotorList.M1
     */
    //% weight=63
    //% blockId=stopMotor block="Laat motor %motor stoppen"
    //% group="Rode en gele dc-motor"
    export function stopMotor(motor: MotorList): void {
        setMotorSpeed(motor, 0)
    }
    /*
     * TODO: Stop all motors, including M1 and M2.
     */
    //% weight=62
    //% blockId=stopAllMotor block="Laat beide dc-motors stoppen"
    //% group="Rode en gele dc-motor"
    export function stopAllMotor(): void {
        setMotorSpeed(MotorList.M1, 0)
        setMotorSpeed(MotorList.M2, 0)
    }
}