import moment from 'moment';
import { IScope, IPromise } from 'angular';
import { DriverData, Ticket, DriverStatus, DetranApiService } from '../shared/index';


/**
 * @class DriverLicenseStatusController
 */
export class DriverLicenseStatusController {

    public static $inject: string[] = [ '$scope', 'detranApiService' ];

    public selectedIndex: number = -1;

    /**
     * Informações sobre a carteira de motorista do condutor
     * 
     * @type {DriverData}
     */
    public driverData: DriverData = undefined;


    /**
     * Lista de multas
     * 
     * @type {Ticket[]}
     */
    public tickets: Ticket[] = [];


    /**
     * Lista de possíveis classificações de multas: leve, média, grave ou gravíssima.
     * 
     * @private
     * @type { name: string, color: string }
     */
    private classifications = [
        { name: 'leve', color: 'green' },
        { name: 'média', color: 'yellow' },
        { name: 'grave', color: 'red' },
        { name: 'gravíssima', color: 'black' }
    ];

    /**
     * @constructor
     *
     * @param {IScope} $scope: $scope - $scope do angular
     * @param {DetranApiService} sepApiService - Api do SEP
     */
    constructor( private $scope: IScope,
        private detranApiService: DetranApiService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }


    /**
     * Preenche a página com dados do condutor, bem como de suas eventuais multas.
     */
    public activate(): void {
        this.getDriverData();
        this.getTickets();
    }

    /**
     * Se dados do condutor já foram carregados.
     * 
     * @readonly
     * @type {boolean}
     */
    public get driverDataPopulated(): boolean {
        return angular.isDefined( this.driverData );
    }


    /**
     * Se as multas do condutor já foram carregadas.
     * 
     * @readonly
     * @type {boolean}
     */
    public get ticketsPopulated(): boolean {
        return !!this.tickets.length;
    }


    /**
     * Se o condutor autenticado no sistema está com a carteira de motorista 'ok'.
     * 
     * @readonly
     * @type {boolean}
     */
    public get licenseOk(): boolean {
        return this.driverDataPopulated && this.driverData.status === DriverStatus.Ok;
    }


    /**
     * Se o condutor autenticado no sistema está com a carteira de motorista bloqueada.
     * 
     * @readonly
     * @type {boolean}
     */
    public get licenseBlocked(): boolean {
        return this.driverDataPopulated && this.driverData.status === DriverStatus.Blocked;
    }

    /**
    * Se o condutor autenticado no sistema está com a carteira de motorista vencida.
    * 
    * @readonly
    * @type {boolean}
    */
    public get licenseExpired(): boolean {
        return this.driverDataPopulated && moment( this.expirationDate ).add( 1, 'months' ).isBefore( moment().startOf( 'day' ) );
    }

    /**
     * Se a carteira de motorista do condutor precisa ser renovada (Período de 1 mês após o vencimento)
     * 
     * @readonly
     * @type {boolean}
     */
    public get licenseRenew(): boolean {
        return this.driverDataPopulated
            && moment( this.expirationDate ).add( 1, 'months' ).isAfter( moment().startOf( 'day' ) )
            && moment().startOf( 'day' ).isAfter( this.expirationDate );
    }


    /**
     * A data de validade da carteira de motorista do condutor autenticado no sistema.
     * 
     * @readonly
     * @type {Date}
     */
    public get expirationDate(): Date {
        if ( this.driverDataPopulated ) {
            return this.driverData.expirationDate;
        }
    }


    /**
     * Indica se existem multas para o condutor autenticado no sistema.
     * 
     * @readonly
     * @type {boolean}
     */
    public get hasTickets(): boolean {
        return this.tickets.length > 0;
    }



    /**
     * O total de pontos acumulados na carteira do condutor autenticado, nos últimos 12 meses.
     * 
     * @readonly
     * @type {number}
     */
    public get last12MonthsPoints(): number {
        let points = 0;
        this.tickets.forEach( ticket => {
            if ( moment( ticket.date ).isAfter( moment().startOf( 'day' ).subtract( 1, 'year' ) ) ) {
                points += ticket.points;
            }
        });
        return points;
    }


    /**
     * Obtem a cor relativa à uma classificação de multa. Usado somente na interface.
     * 
     * @param {string} classificationName
     * @returns {string}
     */
    public getClassificationColor( classificationName: string ): string {
        classificationName = classificationName.toLowerCase();
        let classification = this.classifications.filter( c => c.name === classificationName );

        if ( classification && classification.length === 1 ) {
            return classification[ 0 ].color;
        }
    }

    /**
     * Exibe o detalhamento de uma multa.
     * 
     * @param {number} $index - o índice da multa na lista de multas do condutor exibida.
     */
    public showDetails( $index: number ): void {
        if ( this.selectedIndex !== $index ) {
            this.selectedIndex = $index;
        } else {
            this.selectedIndex = -1;
        }
    }

    /**
     * Obtem dados da carteira de motorista do condutor autenticado no sistema.
     * 
     * @returns {IPromise<DriverData>}
     */
    public getDriverData(): IPromise<DriverData> {
        return this.detranApiService.getDriverData()
            .then(( driverData ) => {
                this.driverData = driverData;
                return driverData;
            });
    }

    /**
     * Obtem as eventuais multas pertencentes ao condutor autenticado no sistema.
     * 
     * @returns {IPromise<Ticket[]>}
     */
    public getTickets(): IPromise<Ticket[]> {
        return this.detranApiService.getTickets()
            .then( tickets => {
                this.tickets = tickets;
                return tickets;
            });
    }
}
