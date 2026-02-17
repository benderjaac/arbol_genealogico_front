import {ChangeDetectorRef, Component, inject, PLATFORM_ID} from '@angular/core';
import {TotalMeses} from '../../../../core/models/estadisticas.model';
import {Subject, takeUntil} from 'rxjs';
import {EstadisticasService} from '../../../../core/services-api/estadisticas.service';
import {DateFormatsService} from '../../servicios/DateFormats.service';
import {ChartModule} from 'primeng/chart';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-grafica-totales-meses',
  imports: [
    ChartModule,
  ],
  standalone: true,
  templateUrl: './grafica-totales-meses.component.html',
})
export class GraficaTotalesMesesComponent {

  DataTotalMesesAPI:TotalMeses[]=[];
  DataTotalMeses:any=undefined;
  OptionsTotalMeses:any=undefined;

  platformId = inject(PLATFORM_ID);

  private destroy$ = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private _estadisticasService: EstadisticasService,
    private _dateFormatsService:DateFormatsService
  ) {

    }

  ngOnInit():void{
    this._estadisticasService.getTotalMeses().pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.DataTotalMesesAPI = response.result.data;
          this.initChartTotalesMes();
        },
        error: (error) => {
          console.error('Error al cargar los datos del total por meses:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initChartTotalesMes() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      const labels = this.DataTotalMesesAPI.map(item =>
        this._dateFormatsService.formatoMesAnio(item.mes));
      const ingresos = this.DataTotalMesesAPI.map(item => item.totalIngresos);
      const gastos = this.DataTotalMesesAPI.map(item => item.totalGastos*-1);

      this.DataTotalMeses = {
        labels: labels,
        datasets: [
          {
            label: 'Ingresos',
            data: ingresos,
            fill: true,
            backgroundColor: [
              'rgba(9, 105, 22, 0.2)'
            ],
            borderColor: ['rgb(5, 46, 12)'],
            borderWidth: 1,
          },
          {
            label: 'Gastos',
            data: gastos,
            fill: true,
            backgroundColor: [
              'rgba(223, 94, 20, 0.2)'
            ],
            borderColor: ['rgb(235, 49, 16)'],
            borderWidth: 1,
          },
        ],
      };

      this.OptionsTotalMeses = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
      this.cd.markForCheck()
    }
  }
}
