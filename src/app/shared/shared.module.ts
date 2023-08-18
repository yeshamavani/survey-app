import {DragDropModule} from '@angular/cdk/drag-drop';
import {LayoutModule} from '@angular/cdk/layout';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkTableModule} from '@angular/cdk/table';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {
  MatNativeDateModule,
  MatRippleModule,
  NativeDateModule,
} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {
  DeleteDialogComponent,
  CopyLinkDialogComponent,
  NoDataFoundComponent,
  ConfirmDialogComponent,
} from './components';

import {AlertToasterComponent} from './components/alert-toaster/alert-toaster.component';
import {UserAvatarComponent} from './components/user-avatar/user-avatar.component';
import {AvatarPipe} from './pipe/avatar.pipe';
import {ThemeModule} from '../theme/theme.module';
import {NgxPermissionsModule} from 'ngx-permissions';
import {MatModule} from './material';

@NgModule({
  declarations: [
    DeleteDialogComponent,
    CopyLinkDialogComponent,
    NoDataFoundComponent,
    ConfirmDialogComponent,
    AvatarPipe,
    UserAvatarComponent,
    AlertToasterComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    CdkTableModule,
    DragDropModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatNativeDateModule,
    MatRippleModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ScrollingModule,
    LayoutModule,
    MatMenuModule,
    MatListModule,
    MatBadgeModule,
    ThemeModule,
    RouterModule,
    NgxPermissionsModule.forChild(),
    NativeDateModule,
    MatModule,
  ],
  providers: [],
  exports: [
    ThemeModule,
    DeleteDialogComponent,
    CopyLinkDialogComponent,
    NoDataFoundComponent,
    MatGridListModule,
    NativeDateModule,
    AvatarPipe,
    MatIconModule,
    DragDropModule,
    UserAvatarComponent,
    AlertToasterComponent,
    MatModule,
  ],
})
export class SharedModule {}
