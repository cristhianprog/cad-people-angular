import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  
  dataForm: FormGroup;
  loading: boolean = false;
  title: string = '';
  idUrl: string;
 
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    public loader: LoadingBarService,
    public snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loader.start();

    this.idUrl = this.activatedRoute.snapshot.params["id"]; //pega id da url

    //criação de formulário reativo  
    this.dataForm = this.formBuilder.group({
      id: [null],
      nome: [null, Validators.required],
      idade: [null, Validators.required],
    });

  
    if(!this.idUrl){
     this.title = 'Cadastrar';
     this.loader.complete();

    }else{
      this.title = 'Editar';

      const saveSubscription: any = this.api.get('pessoa/' + this.idUrl)
      .subscribe((data) => {
        //seta os valores em cada campo
        this.dataForm.get('id')?.setValue(data.id)
        this.dataForm.get('nome')?.setValue(data.nome)
        this.dataForm.get('idade')?.setValue(data.idade)

        this.loader.complete();

      }, err => {
        this.snackBar.open('Falha ao buscar pessoa!', 'Ok', {duration: 3000});
        this.loader.complete();

      });
      this.subscriptions.push(saveSubscription);

    }
   
  }

  submit() {
    this.loading = true;
    this.loader.start();

    //verifica a validaçao dos campos
    if (!this.dataForm.invalid) {

      //verifica se possui id 
      if(this.dataForm.get('id')?.value){
        this.edit();
      }else {
        this.create();
      }

    }else{
      //percorre os campos
      Object.keys(this.dataForm.controls).forEach(field => {
				const control: any = this.dataForm.get(field);
				control.markAsTouched(); //ativa o campo 
			});
      this.snackBar.open('Preencha corretamente os campos!', 'Ok', {duration: 3000});
      this.loading = false;
      this.loader.complete();

      return;
    }
  }

  edit(){
     let dataSend = this.dataForm.value;

			const saveSubscription: any = this.api.put('pessoa', dataSend)
      .subscribe((data) => {
        this.snackBar.open('Pessoa editada com sucesso!', 'Ok', {duration: 3000});
        this.loading = false;
        this.loader.complete();
        this.router.navigate(['/']); //retorna para a lista

      }, err => {
        console.log("Error edit");
        this.loading = true;
      });
      this.subscriptions.push(saveSubscription);

  }

  create(){
      let dataSend = this.dataForm.value;

			const saveSubscription: any = this.api.post('pessoa', dataSend)
      .subscribe((data) => {
        this.snackBar.open('Pessoa registrada com sucesso!', 'Ok', {duration: 3000});
        this.loading = false;
        this.loader.complete();
        this.router.navigate(['/']); //retorna para a lista

      }, err => {
        console.log("Error save");
        this.loading = true;
      });
      this.subscriptions.push(saveSubscription);
  }

}