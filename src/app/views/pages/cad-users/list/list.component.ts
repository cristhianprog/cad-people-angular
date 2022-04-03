import {Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  displayedColumns: string[] = ['id', 'nome', 'idade', 'acoes'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: ApiService, 
              public dialog: MatDialog, 
              public loader: LoadingBarService,
              public snackBar: MatSnackBar,) {}

  ngOnInit(): void {
    this.loader.start();
    this.loadTable();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;

  }

  loadTable() {
    this.api.get('pessoa').subscribe(response => {

			let arrayPeople = response.sort((a: any, b: any) => { //coloca em ordem alfabética
				if (a.nome.toUpperCase() > b.nome.toUpperCase()) {
					return 1;
				}
				else if (a.nome.toUpperCase() < b.nome.toUpperCase()) {
					return -1;
				}
			})

      this.dataSource = new MatTableDataSource(arrayPeople);
      this.dataSource.sort = this.sort;

      this.loader.complete();

    });
  }

  delete(data: any){
    //abre modal
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '600px',
			data: {
				title: 'Excluir',
				question: 'Deseja realmente excluir este registro?',
				other: 'Nome: ' + data.nome
			}
		});

		dialogRef.afterClosed().subscribe(result => {
      this.loader.start();

			if (result) {
        this.snackBar.open('Excluindo...', 'Ok');

        const saveSubscription: any = this.api.delete('pessoa', data.id)
        .subscribe((data) => {
          this.snackBar.open('Pessoa excluída com sucesso!', 'Ok', {duration: 3000});
          this.loader.complete();
          this.loadTable();
  
        }, err => {
          this.snackBar.open('Falha ao excluir pessoa!', 'Ok', {duration: 3000});
          this.loader.complete();

        });
        this.subscriptions.push(saveSubscription);

			}
		});

  }
}