import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../core/layout.service';
import { MenuComponent } from '../../../kt/components';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  headerContainerCssClasses: string = '';
  @ViewChild('ktPageTitle', { static: true }) ktPageTitle: ElementRef;

  private unsubscribe: Subscription[] = [];
// for menu from api
  menuItems: any[] = []; // Array to store menu items  
  isHovered: boolean = false;
  hoveredSubMenu: string = ''; // Track the hovered submenu item by menuId
  activeSubMenu: string = ''; // Track the active submenu (clicked item)

  constructor(private layout: LayoutService, private router: Router,
    private authService: AuthService

  ) {
    this.routingChanges();
  }

  ngOnInit(): void {
    this.headerContainerCssClasses =
      this.layout.getStringCSSClasses('headerContainer');
      // Subscribe to the menu observable
    this.authService.menu$.subscribe((menuData) => {
      console.log('Received menu data:', menuData); // For debugging      
      this.menuItems = this.buildMenu(menuData); // Build the hierarchical menu
      
    });
       
  }
//  methods for menu from api
  toggleSubMenu(menuItem: any): void {
    // Toggle the isOpen flag for displaying/hiding submenus
    menuItem.isOpen = !menuItem.isOpen;
    console.log(`Toggled submenu for: ${menuItem.menuName}, isOpen: ${menuItem.isOpen}`);
  }
  
  onSubMenuClick(menuItem: any): void {
    // Set active submenu item on click
    this.activeSubMenu = menuItem.menuId;
    console.log(`Clicked on submenu: ${menuItem.menuName}`);
  }
  
  // Track which submenu item is hovered
  onSubMenuHover(menuId: string): void {
    this.hoveredSubMenu = menuId;
  }
  
  onSubMenuLeave(): void {
    this.hoveredSubMenu = ''; // Reset hover state when mouse leaves
  }
  
  // Implement the openSubMenu method
  openSubMenu(menuItem: any): void {
    menuItem.isOpen = !menuItem.isOpen;
    console.log(`Submenu for ${menuItem.menuName} opened or closed`);
  }
  
  
  buildMenu(menuItems: any[]): any[] {
    const menuMap = new Map();
  
    // Map all items by menuId
    menuItems.forEach((item) => menuMap.set(item.menuId, { ...item, children: [], isOpen: false }));
  
    const nestedMenu: any[] = [];
  
    // Link parents with their children
    menuItems.forEach((item) => {
      if (item.menuId !== item.parentId) {
        const parent = menuMap.get(item.parentId);
        if (parent) {
          parent.children.push(menuMap.get(item.menuId));
        }
      } else {
        nestedMenu.push(menuMap.get(item.menuId));
      }
    });
  
    return nestedMenu;
  }
  calculateMenuItemCssClass(link: string): string {
    // Return a string (can be empty) for dynamic class logic
    return link === '/apps' ? 'active' : '';
  }



  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        MenuComponent.reinitialization();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy() {}
  
}
