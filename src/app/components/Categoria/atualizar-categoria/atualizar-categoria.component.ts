import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/models/Categoria';
import { Tipo } from 'src/app/models/Tipo';
import { CategoriasService } from 'src/app/services/categorias.service';
import { TiposService } from 'src/app/services/tipos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-atualizar-categoria',
  templateUrl: './atualizar-categoria.component.html',
  styleUrls: ['../listagem-categorias/listagem-categorias.component.css']
})
export class AtualizarCategoriaComponent implements OnInit {
  nomeCategoria: string;
  categoriaID: number;
  categoria: Observable<Categoria>;
  tipos: Tipo[];
  formulario: any;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private tiposService: TiposService, 
    private categoriaSerivce: CategoriasService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.categoriaID = this.route.snapshot.params.id;
    this.tiposService.PegarTodos().subscribe(resultado => {
      this.tipos = resultado;
    })

    this.categoriaSerivce.PegarCategoriaPeloId(this.categoriaID).subscribe(resultado => {
      this.nomeCategoria = resultado.nome;
      this.formulario = new FormGroup({
        categoriaId: new FormControl(resultado.categoriaId),
        nome: new FormControl(resultado.nome),
        icone: new FormControl(resultado.icone),
        tipoId: new FormControl(resultado.tipoId)
      })
    });
  }

  get propriedade() {
    return this.formulario.controls;
  }

  VoltarListagem(): void {
    this.router.navigate(['categorias/listagemcategorias'])
  }

  EnviarFormulario(): void {
    const categoria = this.formulario.value;
    this.categoriaSerivce.AtualziarCategoria(this.categoriaID, categoria).subscribe(resultado => {
      this.router.navigate(['categorias/listagemcategorias']);
      this.snackBar.open(resultado.mensagem, null, {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    });
  }

}
