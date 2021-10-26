import { Component, Inject, OnInit } from '@angular/core';
import { CategoriasService } from 'src/app/services/categorias.service';
import { MatTableDataSource } from '@angular/material/table';
import { CdkPortal } from '@angular/cdk/portal';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators'

@Component({
  selector: 'app-listagem-categorias',
  templateUrl: './listagem-categorias.component.html',
  styleUrls: ['./listagem-categorias.component.css']
})
export class ListagemCategoriasComponent implements OnInit {

  categorias = new MatTableDataSource<any>();
  displayedColumns: string[];
  autoCompleteInput = new FormControl();
  opcoesCategorias: string[] = [];
  nomesCategorias: Observable<string[]>;

  constructor(private categoriasService: CategoriasService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.categoriasService.PegarTodos().subscribe(resultado => {
      resultado.forEach(categoria => {
        this.opcoesCategorias.push(categoria.nome);
      });
      this.categorias.data = resultado;
    });

    this.displayedColumns = this.ExibirColunas();

    this.nomesCategorias = this.autoCompleteInput.valueChanges.pipe(startWith(''), map(nome => this.FiltrarNomes(nome)));
  }

  ExibirColunas(): string[] {
    return ['nome', 'icone', 'tipo', 'acoes']
  }

  AbrirDialog(categoriaID, nome): void {
    this.dialog.open(DialogExclusaoCategoriasComponent, {
      data: {
        categoriaID: categoriaID,
        nome: nome
      }
    }).afterClosed().subscribe(resultado => {
      if (resultado === true) {
        this.categoriasService.PegarTodos().subscribe((dados) => {
          this.categorias.data = dados;
        });
        this.displayedColumns = this.ExibirColunas();
      }
    });
  }

  FiltrarNomes(nome: string): string[] {
    if (nome.trim().length >= 4) {
      this.categoriasService.FiltrarCategorias(nome.toLowerCase()).subscribe((resultado) => {
        this.categorias.data = resultado;
      });
    }
    else {
      if (nome === '') {
        this.categoriasService.PegarTodos().subscribe((resultado) => {
          this.categorias.data = resultado;
        });
      }
    }
    return this.opcoesCategorias.filter((categoria) =>
      categoria.toLowerCase().includes(nome.toLowerCase())
    );
  }
}

@Component({
  selector: 'app-dialog-exclusao-categorias',
  templateUrl: 'dialog-exclusao-categorias.html',
})

export class DialogExclusaoCategoriasComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public dados: any,
    private categoriasService: CategoriasService) { }

  ExcluirCategoria(categoriaID): void {
    this.categoriasService.ExcluirCategoria(categoriaID).subscribe(resultado => {

    });
  }
}
