import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Configs, Configuration } from './configuration';
import { Language } from './language';

export interface Plugin {
    config: Configuration,
    translate: Language,
    name: string
}

export class Plugin implements Plugin {
    private configs: string = join( __dirname, '..', '..', '..', '..', 'config' );
    private configPath: string
    private configFile: {
        main: string,
        rooms: string,
        antiSpam: string,
    }

    constructor ( initConfiguration: Configuration, initTranslate: Language ) {
        this.name = initTranslate.name

        this.generateConfigPaths()
        this.checkForders()
        this.checkConfigs( initConfiguration )
        this.loadTranslate( initTranslate )
    }

    private generateConfigPaths(): void {
        this.configPath = join( this.configs, this.name );
        this.configFile = {
            main: join( this.configPath, 'main.json' ),
            rooms: join( this.configPath, 'rooms.json' ),
            antiSpam: join( this.configPath, 'antiSpam.json' ),

        }
    }
    private checkForders(): void {
        if( !existsSync( this.configs ) ) mkdirSync( this.configs )

        if( !existsSync( this.configPath ) ) mkdirSync( this.configPath )

        const langsPath = join( this.configPath, 'lang' )
        if( !existsSync( langsPath ) ) mkdirSync( langsPath )
    }

    private checkConfigs( initConfiguration: Configuration ): void {
        if( !existsSync( this.configFile.main ) ) writeFileSync( this.configFile.main, JSON.stringify( initConfiguration.main, null, 4 ) )
        if( !existsSync( this.configFile.antiSpam ) ) writeFileSync( this.configFile.antiSpam, JSON.stringify( initConfiguration.antiSpam, null, 4 ) )
        if( !existsSync( this.configFile.rooms ) ) writeFileSync( this.configFile.rooms, JSON.stringify( initConfiguration.rooms, null, 4 ) )


        this.loadConfigs()
    }

    private loadConfigs(): void {
        this.config = {
            main: JSON.parse( readFileSync( this.configFile.main, 'utf8' ) ),
            rooms: JSON.parse( readFileSync( this.configFile.rooms, 'utf8' ) ),
            antiSpam: JSON.parse( readFileSync( this.configFile.antiSpam, 'utf8' ) )
        }
    }

    private loadTranslate( initTranslate: Language ): void {
        const usedLangPath = join( this.configPath, 'lang', `${this.config.main.language}.json` )

        if( !existsSync( usedLangPath ) ) writeFileSync( usedLangPath, JSON.stringify( initTranslate, null, 4 ) )

        this.translate = JSON.parse( readFileSync( usedLangPath, 'utf8' ) )

    }
    public log( message: string ): void {
        const name: string = `[`.red + this.name.green + `]`.red
        const msg: string = `${message}`.green
        console.log( `${name} ${msg}` )
    }

    public updateConfig( config: Configs ): void {
        let configFromFIle
        switch( config )
        {
            case Configs.main:
                configFromFIle = JSON.parse( readFileSync( this.configFile.main, 'utf8' ) )
                if( configFromFIle != this.config ) writeFileSync( this.configFile.main, JSON.stringify( this.config.main, null, 4 ) )
                this.log( 'config updated' )
                break;
            case Configs.antiSpam:
                configFromFIle = JSON.parse( readFileSync( this.configFile.antiSpam, 'utf8' ) )
                if( configFromFIle != this.config ) writeFileSync( this.configFile.antiSpam, JSON.stringify( this.config.antiSpam, null, 4 ) )
                this.log( 'config updated' )
                break;
            case Configs.rooms:
                configFromFIle = JSON.parse( readFileSync( this.configFile.rooms, 'utf8' ) )
                if( configFromFIle != this.config ) writeFileSync( this.configFile.rooms, JSON.stringify( this.config.rooms, null, 4 ) )
                this.log( 'config updated' )
                break;
        }
    }

}