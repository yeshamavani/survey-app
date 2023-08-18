import {MatSelect, MAT_SELECT_CONFIG} from '@angular/material/select';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
  NgZone,
} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {cloneDeep, unionBy} from 'lodash';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {AnyObject} from '../../../../core/models/backend-filter';
import {APP_CONSTANTS} from '../../../../shared/constants';
import {ngDebounce} from '../../../../shared/decorators/debounce.decorator';
import {MatFormFieldAppearance} from '@angular/material/form-field';
import {MyErrorStateMatcher} from '../my-error-state.class';

const debounceTIme = 500;

@Component({
  selector: 'select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: {overlayPanelClass: 'selectOverlay'},
    },
  ],
})
export class SelectBoxComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  _data: any = [];
  _completeData: any[] = [];
  _searchedData: any = [];
  currentTab: any;
  matcher = new MyErrorStateMatcher();
  showGroupAssignedList = false;
  searchText = '';
  ValidatorsArray: any[] = [];
  tabIndexSelected = 0;
  currentTabBackup = [];
  searchPlaceHolder = 'Search...';
  reset: any;
  isPanelOpened = false;
  _allSelectedValues = false;
  _dataId: string;
  selectedObjectValues: any = [];
  selectedObjectValue: AnyObject;
  isSearched: boolean;
  lastScrolledHeight = 0;
  searchControl: FormControl = new FormControl('', []);
  @Input() type: 'single' | 'groupRelated' | 'multiple' | 'groupAssigned' =
    'single';
  @Input() trigger = false;
  @Input() requiredFromGeneralDetailTab = false;
  @Input() withLabel = true;
  @Input() set data(val) {
    this._data = val ?? [];
    if (Array.isArray(this._data)) {
      this._data = this._data.filter(d => d);
    }
    this._completeData = cloneDeep(val) ?? [];
    this._searchedData = cloneDeep(val) ?? [];
    // Reset last scrolled height when the data is set
    this.lastScrolledHeight = 0;
  }
  get data() {
    return this._data || [];
  }
  @Input() validateArray: any = {};
  @Input() chips: any = [];
  @Input() label = '';
  @Input() infoText = '';
  @Input() color: ThemePalette = 'primary';
  @Input() preIcon = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() selected: any;
  @Input() multiple = false;
  @Input() valueType = 'object';
  @Input() placeholder = 'Please Select';
  @Input() margin = '0';
  @Input() preIconSize: any;
  @Input() preIconColor: any;
  @Input() showCapitalize = false;
  @Input() hideRequiredMarker = false;
  @Input() noPadding = false;
  @Input() panelClass = '';
  @Input() appearance: MatFormFieldAppearance;
  @Input() set setValue(value: any) {
    this.selected = value;
  }
  @Input() control: FormControl = new FormControl('', []);
  @Input()
  errorMessages!: Function;
  @Input() img = false;
  @Input() icon = false;
  @Input('automation-id') automationId: string = '';
  @Input('value-key') valueKey: string = 'value';
  @Input('label-key') labelKey: string = 'text';
  @Input('sort-key') sortKey: string = '';
  @Input('sort-order') sortOrder: 'asc' | 'desc' = 'asc';
  @Input('tooltip-key') tooltipKey: string;
  @Input('tooltip-mandatory') isTooltipMandatory: string;
  /**
   * @secondLabelKey Used to display 2 labels one top of another. Ex- Name and there email just below the name.
   * Currently it is working only for,[valueType]="object".
   */
  @Input('second-label-key') secondLabelKey: string | number;
  @Input() secondLabelPrefix = '';
  @Input('count-key') countKey: string;
  @Input('icon-key') iconKey = 'iconClass';
  @Input('color-key') colorKey = 'color';
  @Input() selectedOptionCount = false;
  @Input() textStrike = false;
  @Input() emptyPlaceholder: string;
  @Input() limit = APP_CONSTANTS.PAGINATION_LIMIT;
  @Input() offset = 0;
  searchString = '';
  @Input() triggerType: 'all' | 'chips' | 'completed' = 'all';
  @Input() touched = false;
  // Show select box without border
  @Input() showSelectWithoutBorder = false;
  @Input() matOptionInfoText = '';
  @Input() noDataFoundText = '';
  @Input('data-id')
  set dataId(val: string) {
    if (val) {
      this._dataId = val;
    }
  }
  get dataId() {
    return this._dataId;
  }

  get allSelectedValues() {
    return this._allSelectedValues;
  }

  set allSelectedValues(val: boolean) {
    this._allSelectedValues = !!val;
  }
  @Input() openOnSelect = false;
  @Input() showSearch = false;
  @Input() addNoneOption = false;
  @Input() lazyLoadServerSide = false;
  @Input() selectionLimit: number;
  @Input() hideChipRemoveIcon = false;
  @Input() maxOptionsCanBeSelected: number;
  @Output() selectResult = new EventEmitter();
  @Output() resetChange = new EventEmitter();
  @Output() openedChange = new EventEmitter<boolean>();
  @Output() optionsScrolled = new EventEmitter();
  @Output() searched = new EventEmitter();
  @Output() selectClosed = new EventEmitter();
  @Output() chipRemoved = new EventEmitter();
  @Input() showAllOption = true;
  @Input() toolTip: string;
  @Input() valuesToShowInSelectBox = 2;
  @Input() maxSelectionErrorMsg = '';
  @Input() loading = false;
  getErrorMessage() {
    const hundred = 100;
    setTimeout(() => {
      this.cdr.detectChanges();
    }, hundred);

    return this.control.hasError('required')
      ? this.validateArray.hasOwnProperty('required')
        ? this.validateArray.required
        : 'Please select a value'
      : this.control.hasError('email')
      ? this.validateArray.hasOwnProperty('email')
        ? this.validateArray.email
        : 'Invalid Email entered'
      : this.control.hasError('pattern')
      ? this.validateArray.hasOwnProperty('pattern')
        ? this.validateArray.pattern
        : 'Invalid value entered'
      : '';
  }

  searching = false;

  @ViewChild('select')
  selector!: {close: () => void};

  @ViewChild('singleStringSelectBox')
  singleStringSelectBox: MatSelect;

  @ViewChild('singleObjectSelectBox')
  singleObjectSelectBox: MatSelect;

  @ViewChild('singleObjectWithImgSelectBox')
  singleObjectWithImgSelectBox: MatSelect;

  @ViewChild('multipleStringSelectBox')
  multipleStringSelectBox: MatSelect;

  @ViewChild('multipleObjectSelectBox')
  multipleObjectSelectBox: MatSelect;

  get selectedNames() {
    // the selected values of the object type options are the values of their value Keys
    // so finding label value of the selected option value from the array of object type options
    return this.multipleObjectSelectBox?.value?.map(
      (s: any) =>
        this.data.find((t: {[x: string]: any}) => t[this.valueKey] === s)[
          this.labelKey
        ],
    );
  }

  get selectedIds() {
    return this.multipleObjectSelectBox?.value?.map(
      (s: {[x: string]: any}) => s[this.valueKey],
    );
  }

  errMessage = '';
  private _subscriptions: Subscription[] = [];
  constructor(
    protected readonly ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private readonly toaster: ToastrService,
  ) {}
  ngOnChanges(changes: {hasOwnProperty: (arg0: string) => any}) {
    if (
      changes.hasOwnProperty('data') &&
      this.selected &&
      (typeof this.selected === 'string' || Array.isArray(this.selected)) &&
      (this.type === 'multiple' || this.type === 'single') &&
      this.valueType === 'object'
    ) {
      /* when already selected options are available in select-box, 
      On very first time dropdown options or not sorted. Which gets fixed by setTimeout*/
      setTimeout(() => {
        this.sortOptionsData();
      }, 0);
      this.updateSingleSelectObject();

      if (this.lazyLoadServerSide) {
        // Since in case of lazy loaded lists, it may possible that more data is fetched after "Select All", hence keep updating it.
        this.allSelectedValues = this.selected?.length === this.data.length;
      }
    }

    if (changes) {
      if (changes.hasOwnProperty('reset') && this.reset) {
        this.refresh();
        const timeout = 200;
        setTimeout(() => {
          this.reset = false;
          this.resetChange.emit(false);
          this.cdr.detectChanges();
        }, timeout);
      }

      if (changes.hasOwnProperty('selected')) {
        this.updateSelected();
      }
      if (changes.hasOwnProperty('touched')) {
        this.errMessage = this.control?.invalid ? this.getErrorMessage() : '';
      }
    }
  }

  ngOnInit() {
    if (!this.sortKey) {
      this.sortKey = this.labelKey;
    }
    if (this.secondLabelPrefix !== '') {
      this.searchPlaceHolder = 'Search by Name/ID';
    }
    this.tooltipKey = this.tooltipKey ? this.tooltipKey : this.labelKey;
    if (this.showSearch) {
      this.getNextBatch();
    }
    if (this.type === 'groupRelated' || this.type === 'groupAssigned') {
      this.currentTab = this.data[0];
      if (this.type === 'groupRelated') {
        this.fillUserListDefault();
      }
      if (this.type === 'groupAssigned') {
        this.searchPlaceHolder = 'Search User...';
        this.searchFor('');
      }
    }
    if (this.required) this.ValidatorsArray.push(Validators.required);
    this.control = !this.control
      ? new FormControl('', this.ValidatorsArray)
      : this.control;
    this.errorMessages = this.errorMessages
      ? this.errorMessages
      : this.getErrorMessage;

    this.updateSelected();
    this.touched = this.control.touched;

    if (this.maxOptionsCanBeSelected && this.type === 'multiple') {
      this.maxSelectionErrorMsg = this.maxSelectionErrorMsg
        ? this.maxSelectionErrorMsg
        : `Maximum ${this.maxOptionsCanBeSelected} ${this.label} can be selected.`;
      this._subscriptions.push(
        this.control.valueChanges.subscribe(values => {
          if (values?.length > this.maxOptionsCanBeSelected) {
            this.control.setValue(
              values.slice(0, this.maxOptionsCanBeSelected),
            );
            this.toaster.error(this.maxSelectionErrorMsg);
          }
        }),
      );
    }
    this.cdr.detectChanges();
  }

  refreshSelectBox() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this._subscriptions = [];
  }

  updateSelected() {
    if (
      this.type === 'multiple' &&
      this.valueType === 'object' &&
      this.selected
    ) {
      this.selectedObjectValues = this.selected
        .map((val: any) =>
          this._completeData.find(
            (data: {[x: string]: any}) => data[this.valueKey] === val,
          ),
        )
        .filter((value: any) => value);
      if (this.labelKey) {
        // sort mat-chips data
        this.selectedObjectValues.sort(
          (a: {[x: string]: string}, b: {[x: string]: any}) => {
            if (
              a[this.labelKey].toLowerCase() > b[this.labelKey].toLowerCase()
            ) {
              return 1;
            }
            return b[this.labelKey].toLowerCase() >
              a[this.labelKey].toLowerCase()
              ? -1
              : 0;
          },
        );
      }
    }
    this.updateSingleSelectObject();
    if (
      this.selected &&
      (typeof this.selected === 'string' || Array.isArray(this.selected)) &&
      (this.type === 'multiple' || this.type === 'single') &&
      this.valueType === 'object'
    ) {
      this.sortOptionsData();
    }
    this.allSelectedValues = this.selected
      ? this.selected?.length === this.data?.length
      : false;
  }

  sortOptionsData() {
    if (this.showSearch && this.type !== 'multiple') {
      this._data = this._data.reduce(
        (acc: any, element: {[x: string]: any}) => {
          if (this.selected?.includes(element[this.valueKey])) {
            return [element, ...acc];
          }
          return [...acc, element];
        },
        [],
      );
    } else if (this.type === 'multiple') {
      if (this.valueType === 'object') {
        this._data.sort((a: {[x: string]: string}, b: {[x: string]: any}) => {
          const isSelectedA = this.isSelected(a);
          const isSelectedB = this.isSelected(b);

          if (isSelectedA !== isSelectedB) {
            // One of the elements is selected, prioritize selected items
            return Number(isSelectedB) - Number(isSelectedA);
          }

          // Both elements have the same selected status
          const comparisonResult = a[this.sortKey].localeCompare(
            b[this.sortKey],
          );

          return this.sortOrder === 'asc'
            ? comparisonResult
            : -comparisonResult;
        });
      }
      if (this.valueType === 'string') {
        this._data.sort((a: any, b: any) => {
          if (this.isSelected(a) === this.isSelected(b)) {
            return a.localeCompare(b);
          }
          return Number(this.isSelected(b)) - Number(this.isSelected(a));
        });
      }
    } else {
      //do nothing
    }
  }

  updateSingleSelectObject() {
    if (
      this.selected !== this.selectedObjectValue?.[this.valueKey] &&
      this.valueType === 'object' &&
      this.type === 'single'
    ) {
      this.ngZone.runOutsideAngular(() => {
        this.ngZone.run(() => {
          this.selectedObjectValue = this._completeData.find(
            (data: {[x: string]: any}) => data[this.valueKey] === this.selected,
          );
        });
      });
    }
  }
  isSelected(elem: {[x: string]: any}) {
    if (this.valueType === 'object') {
      return (
        this.selected === elem[this.valueKey] ||
        (Array.isArray(this.selected) &&
          this.selected?.some(id => id === elem[this.valueKey]))
      );
    }
    return (
      this.selected === elem ||
      (Array.isArray(this.selected) && this.selected?.some(id => id === elem))
    );
  }
  ngAfterViewInit() {
    if (this.openOnSelect) {
      if (this.singleStringSelectBox) {
        this.singleStringSelectBox.open();
      } else if (this.singleObjectSelectBox) {
        this.singleObjectSelectBox.open();
      } else if (this.singleObjectWithImgSelectBox) {
        this.singleObjectWithImgSelectBox.open();
      } else if (this.multipleStringSelectBox) {
        this.multipleStringSelectBox.open();
      } else if (this.multipleObjectSelectBox) {
        this.multipleObjectSelectBox.open();
      } else {
        // do nothing
      }
    }
  }

  selectionChanged(form: FormControl) {
    this.selected = form.value;

    if (this.valueType === 'object' && this.type === 'multiple') {
      // Remove the selections exceeding the selection limit
      if (this.selectionLimit && this.selected?.length > this.selectionLimit) {
        this.selected.pop();
        form.setValue(this.selected);
      }
      this.selectedObjectValues = this.selected.map((val: any) =>
        this._completeData.find(
          (data: {[x: string]: any}) => data[this.valueKey] === val,
        ),
      );
    }
    this.updateSingleSelectObject();

    this.selectResult.emit(this.valueType === 'string' ? this.selected : form);
    this.allSelectedValues = this.selected?.length === this.data.length;
  }

  toggleAllSelectionString(event: boolean) {
    if (event) {
      this.multipleStringSelectBox.value = [...this.data];
    } else {
      this.multipleStringSelectBox.value = [];
    }
    this.selectResult.emit(this.multipleStringSelectBox.value);
    this.control?.markAsDirty();
    this.control?.setValue(this.multipleStringSelectBox.value);
    this.selected = this.multipleStringSelectBox.value;
    this.allSelectedValues = this.selected?.length === this.data.length;
  }

  toggleAllSelectionObject(event: boolean) {
    if (event) {
      this.multipleObjectSelectBox.value = [
        ...this.data.map((d: {[x: string]: any}) => d[this.valueKey]),
      ];
      this.selectedObjectValues = [...this.data];
    } else {
      this.multipleObjectSelectBox.value = [];
      this.selectedObjectValues = [];
    }
    this.control?.markAsDirty();
    this.control?.setValue(this.multipleObjectSelectBox.value);
    this.selected = this.multipleObjectSelectBox.value;
    this.allSelectedValues = this.selected?.length === this.data.length;
    this.selectResult.emit(this.selected);
  }

  refresh() {
    this.selected = '';
  }

  selectTab(tab: {text: string}) {
    const lastTab = JSON.parse(JSON.stringify(this.currentTab));
    this.showGroupAssignedList = this.type !== 'groupAssigned';
    if (
      this.type === 'groupAssigned' &&
      lastTab &&
      lastTab.text &&
      lastTab.text.toString().toLowerCase() === 'user' &&
      this.currentTabBackup &&
      this.currentTabBackup.length
    ) {
      this.setDefault();
    }
    this.currentTab = tab;
    this.searchText = '';
    if (this.type === 'groupAssigned') {
      this.chips = [];
      this.searchPlaceHolder =
        tab.text.toLowerCase() === 'user'
          ? 'Search user...'
          : 'Search work group...';
    }
  }

  add(tab: {text: string}, item: {group: any; value: any}) {
    if (tab.text.toLowerCase() === 'agent') {
      this.selectResult.emit({group: item.group, agent: item.value});
      this.selected = item.value;
      this.selector.close();
      this.currentTab = this.data[0];
      return;
    }
    this.addChips(item);
    if (tab.text.toLowerCase() === 'group' && this.type === 'groupRelated') {
      this.fillUserList();
      this.currentTab = this.data[1];
    }
  }

  addChips(item: {group?: any; value?: any; list?: any; text?: any}) {
    if (!this.chips.includes(item.text)) {
      if ((item.text || '').trim()) {
        this.chips.push(item.text.trim());
      }
    }
  }

  fillUserListDefault() {
    this.data[1].data = this.data[0].data.flatMap(
      (x: {list: any[]; text: string}) =>
        x.list.map((item: string) => {
          return {text: item + ' - ' + x.text, group: x.text, value: item};
        }),
    );
  }

  fillUserList() {
    this.data[1].data = [];
    this.chips.forEach((chip: string) => {
      const list = this.data[0].data.filter(
        (x: {text: any}) => x.text === chip,
      );
      if (list) {
        if (list.length && list[0].list) {
          this.data[1].data = this.data[1].data.concat(
            list[0].list.map((item: string) => {
              return {text: item + ' - ' + chip, group: chip, value: item};
            }),
          );
        }
      }
    });
  }

  remove(value: {[x: string]: any}): void {
    let allSelectedValues: any; //NOSONAR
    if (this.valueType === 'string') {
      allSelectedValues = this.selected.filter((val: any) => val !== value);
    } else {
      allSelectedValues = this.selected.filter(
        (val: any) => val !== value[this.valueKey],
      );

      this.selectedObjectValues = allSelectedValues.map((val: any) =>
        this._completeData.find(
          (data: {[x: string]: any}) => data[this.valueKey] === val,
        ),
      );
    }

    this.selectResult.emit(allSelectedValues);
    const timeout = 10;
    setTimeout(() => {
      this.control?.markAsDirty();
      this.control?.setValue(allSelectedValues);
      this.selected = allSelectedValues;
      this.allSelectedValues = this.selected?.length === this.data.length;
      this.chipRemoved.emit();
      this.cdr.detectChanges();
    }, timeout);
  }

  /**
   * below functions used in type = 'groupAssigned'
   * @param tab selected tab
   * @param chip case item for remove from chips
   */
  removeItemInGroupAssigned(tab: {text: string}, chip: any): void {
    const index = this.chips.indexOf(chip);
    if (index >= 0) {
      this.chips.splice(index, 1);
    }
    if (tab.text.toLowerCase() === 'user') {
      this.fillGroupAssignedListDefault(true);
    }
    this.searchFor('');
  }

  /**
   * @param remove fill automatically as true if called from removeItemInGroupAssigned function
   */
  fillGroupAssignedListDefault(remove?: boolean | undefined) {
    this.currentTab.data = JSON.parse(JSON.stringify(this.currentTabBackup));
    this.selectResult.emit(this.chips[0]);
    this.selected =
      this.chips[0] && this.chips[0].toString().length
        ? this.chips[0].split('(')[0].trim()
        : this.chips[0];
    if (!remove) {
      this.selector.close();
    } else {
      this.currentTabBackup = [];
    }
  }

  /**
   * @param tab pass selected tab
   * @param item which selected to emit and also add to chips
   */
  addGroupAssigned(tab: {text: string}, item: {list: any; text: string}) {
    this.addToChipsGroupAssigned(item, tab);
    if (tab.text.toLowerCase() === 'user' && this.type === 'groupAssigned') {
      this.searchText = '';
    }
    if (
      tab.text.toLowerCase() === 'work group' &&
      this.type === 'groupAssigned'
    ) {
      this.searchText = '';
      this.selectResult.emit(this.chips[0]);
      this.selected = this.chips[0];
      this.selector.close();
    }
  }

  /**
   * @param tab pass selected tab
   * @param item which selected for adding to chips list
   */
  addToChipsGroupAssigned(
    item: {list: any; text: string}, //NOSONAR
    tab: {text: string},
  ) {
    if (tab.text.toLowerCase() === 'user') {
      if (this.chips.length) {
        if (this.chips[0].indexOf('(') > -1) {
          this.chips = [];
          this.currentTabBackup = JSON.parse(
            JSON.stringify(this.currentTab.data),
          );
          this.currentTab.data = item.list;
        } else {
          this.chips[0] = this.chips[0] + ' ( ' + item.text.trim() + ' ) ';
          this.fillGroupAssignedListDefault();
          return;
        }
      } else {
        this.currentTabBackup = JSON.parse(
          JSON.stringify(this.currentTab.data),
        );
        this.currentTab.data = item.list;
      }
    } else if (tab.text.toLowerCase() === 'work group') {
      this.chips = [];
    } else {
      // do nothing
    }
    this.addChips(item);
  }

  searchFor(event: string) {
    this.showGroupAssignedList = event?.toString().length > 1 ? true : false;
  }

  checkClose() {
    if (
      this.currentTab &&
      this.currentTab.text &&
      this.currentTab.text.toLowerCase() === 'user' &&
      this.chips[0] &&
      this.chips[0].indexOf('(') === -1
    ) {
      this.chips = [];
      this.setDefault();
    }
  }

  setDefault() {
    this.currentTab.data = JSON.parse(JSON.stringify(this.currentTabBackup));
    this.currentTabBackup = [];
  }

  deleteSearchText() {
    if (this.searchText.length) {
      this.searchText = '';
    }
    if (!this.currentTabBackup || !this.currentTabBackup.length) {
      this.showGroupAssignedList = false;
    }
  }

  handleOpenedChange(event: boolean) {
    this.openedChange.emit(event);
    this.isPanelOpened = event;
    if (this.openOnSelect) {
      if (this.singleStringSelectBox) {
        this.singleStringSelectBox.focus();
      } else if (this.singleObjectSelectBox) {
        this.singleObjectSelectBox.focus();
      } else if (this.singleObjectWithImgSelectBox) {
        this.singleObjectWithImgSelectBox.focus();
      } else if (this.multipleStringSelectBox) {
        this.multipleStringSelectBox.focus();
      } else if (this.multipleObjectSelectBox) {
        this.multipleObjectSelectBox.focus();
      } else {
        // do nothing
      }
    }
    if (this.isPanelOpened) {
      this.selectAllValues();
    }
  }

  selectAllValues() {
    this.allSelectedValues = this.selected
      ? this.selected?.length === this._completeData?.length
      : false;
  }

  onSearch(value: string) {
    if (!this.lazyLoadServerSide) {
      this._onSearch(value);
      this.selectAllValues();
    } else {
      this.emitSearched(value);
      // This is intentional
    }
  }

  closingMultiSelect() {
    this.searchControl.reset();
    this.onSearch('');
    this.sortOptionsData();
    this.closingSelect();
  }
  closingSingleSelect() {
    this.searchControl.reset();
    this.onSearch('');
    if (this.showSearch) {
      this.sortOptionsData();
    }
    this.closingSelect();
  }
  closingSelect() {
    this.selectClosed.emit();
  }

  private _onSearch(value: string) {
    this.searching = true;
    this.searchString = value;
    if (value?.trim() === '') {
      this.searching = false;
      this._searchedData = cloneDeep(this._completeData);
      this._data = this._completeData.slice(0, this.limit);
      this.offset = this.limit;
      this.retainSelection();
    } else if (this.valueType === 'string') {
      // filter string data
      this._searchedData = this._completeData.filter(
        (data: {toString: () => string}) =>
          data
            ?.toString()
            ?.toLowerCase()
            ?.includes(value?.trim()?.toLowerCase()),
      );
      // load first limit results onlye
      this._data = this._searchedData.splice(0, this.limit);
      this.offset = this.limit;
    } else if (this.valueType === 'object') {
      // filter object options based on label
      if (this.secondLabelKey) {
        this._searchedData = this._completeData.filter(
          (data: {[x: string]: string}) =>
            this.createSearchString(data[this.labelKey])?.includes(
              value?.trim().toLowerCase(),
            ) ||
            this.createSearchString(data[this.secondLabelKey])?.includes(
              value?.trim().toLowerCase(),
            ),
        );
      } else {
        this._searchedData = this._completeData.filter(
          (data: {[x: string]: {toString: () => string}}) =>
            data[this.labelKey]
              ?.toString()
              ?.toLowerCase()
              ?.includes(value?.trim().toLowerCase()),
        );
      }

      this._data = this._searchedData.splice(0, this.limit);
      this.retainSelection();
      this.offset = this.limit;
    } else {
      // do nothing
    }
  }

  createSearchString(str: string) {
    return str?.toString()?.toLowerCase();
  }

  retainSelection() {
    if (this.showSearch && this.type === 'single' && this.selected) {
      this.keepSelected();
    } else if (this.showSearch && this.type === 'multiple' && this.selected) {
      this.keepSelectedMultiple();
    } else {
      // do nothing
    }
  }

  onScroll(event: any) {
    const currentScroll = event.target.offsetHeight + event.target.scrollTop;
    if (currentScroll < event.target.scrollHeight) {
      return;
    }
    // when element reaches bottom fetch new records
    if (this.lazyLoadServerSide) {
      // emit only when scroll height is changed
      currentScroll > this.lastScrolledHeight && this.emitScrolled();
    } else {
      this._onScroll();
    }
    this.lastScrolledHeight = currentScroll;
  }

  _onScroll() {
    const scrollTop = this.getNextBatch();
    const num150 = 150;
    if (scrollTop) {
      const ele = document.getElementById('select-scroller');
      if (ele) {
        ele.scrollTop = ele.scrollHeight - num150;
      }
    }
  }

  getNextBatch() {
    // Do nothing if server side lazy loading
    if (this.lazyLoadServerSide) {
      return;
    }

    // get next batch of options if options are too large
    let result;
    if (this.searching) {
      if (this.offset >= this._searchedData.length) {
        this.offset = this._completeData.length;
        return false;
      }
      result = this._searchedData.slice(0, this.offset + this.limit);
    } else {
      if (this.offset >= this._completeData.length) {
        this.offset = this._completeData.length;
        return false;
      }
      result = this._completeData.slice(0, this.offset + this.limit);
    }

    this._data = [...result];
    this.offset += this.limit;
    return true;
  }

  @ngDebounce(debounceTIme)
  emitSearched(value: string) {
    this.searched.emit(value);
  }

  emitScrolled() {
    this.optionsScrolled.emit(true);
  }

  /**
   * If Search result is blank, and dropdown already had any value selected, then keep it selected.
   * Currently it is being done only for type='single' & valueType='object'
   */
  keepSelected() {
    if (this.valueType === 'object') {
      const alreadySelected = this._completeData.find(
        (d: {[x: string]: any}) => d[this.valueKey] === this.selected,
      );
      if (
        this._data.some(
          (d: {[x: string]: any}) => d[this.valueKey] === this.selected,
        )
      ) {
        this._data = this._data.map(
          (d: {[x: string]: any; hidden: boolean}) => {
            if (d[this.valueKey] === this.selected) {
              d.hidden = false;
            }
            return d;
          },
        );
      } else {
        if (alreadySelected) {
          alreadySelected.hidden = true;
          this._data = [...this._data, alreadySelected];
        }
      }
    }
  }

  keepSelectedMultiple() {
    if (this.valueType === 'object') {
      const alreadySelected = [...this._completeData]
        .filter(data => {
          if (this.selected.includes(data[this.valueKey])) {
            return data;
          }
        })
        .map(d => {
          if (
            !d[this.labelKey]
              ?.toString()
              ?.toLowerCase()
              ?.includes(this.searchString?.trim().toLowerCase())
          ) {
            d.hidden = true;
          } else {
            d.hidden = false;
          }
          return d;
        });
      this._data = unionBy(this._data, alreadySelected, this.valueKey);
    }
  }
}
