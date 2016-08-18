import moment from 'moment';
import { IScope, IPromise } from 'angular';
import { Ticket, Vehicle, DetranApiService, TicketColorService } from '../shared/index';


/**
 * @class DriverLicenseStatusController
 */
export class VehicleTicketsController {

    public static $inject: string[] = [ '$scope', '$stateParams', 'ticketColorService', 'detranApiService' ];

    /**
     * Lista de multas
     * 
     * @type {Ticket[]}
     */
    public tickets: Ticket[];
    public vehicle: Vehicle;
    /**
     * 
     * 
     * @readonly
     * @type {boolean}
     */
    public get ticketsPopulated(): boolean {
        return angular.isDefined( this.tickets );
    }


    /**
     * Creates an instance of VehicleTicketsController.
     * 
     * @param {IScope} $scope
     * @param {angular.ui.IStateService} $stateParams
     * @param {TicketColorService} detranApiService
     * @param {DetranApiService} ticketColorService
     */
    constructor( private $scope: IScope,
                 private $stateParams: angular.ui.IStateService,
                 private ticketColorService: TicketColorService,
                 private detranApiService: DetranApiService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );

        this.vehicle = {
            plate: this.$stateParams.plate,
            renavam: this.$stateParams.renavam
        };
    }


    /**
     * Preenche a página com dados do condutor, bem como de suas eventuais multas.
     */
    public activate(): void {
        this.getVehicleTickets( this.vehicle );
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
     * Obtem a cor relativa à uma classificação de multa. Usado somente na interface.
     * 
     * @param {string} level
     * @returns {string}
     */
    public getTicketLevelColor( level: string ): string {
        return this.ticketColorService.getTicketLevelColor( level );
    }

    /**
     * 
     * 
     * @param {Vehicle} vehicle
     * @returns {IPromise<Ticket[]>}
     */
    public getVehicleTickets( vehicle: Vehicle ): IPromise<Ticket[]> {
        return this.detranApiService.getVehicleTickets( vehicle )
            .then( tickets => {
                this.tickets = tickets || [];
                return this.tickets;
            });
    }
}