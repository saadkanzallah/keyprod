<template>
    <ul class="layout-menu">
        <li class="layout-root-menuitem">
            <div class="layout-menuitem-root-text">Menu Principal</div>
            <ul class="layout-submenu">
                <li>
                    <RouterLink to="/" tabindex="0">
                        <i class="pi pi-fw pi-home layout-menuitem-icon"></i>
                        <span class="layout-menuitem-text">Dashboard</span>
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/orders" tabindex="0">
                        <i class="pi pi-fw pi-list layout-menuitem-icon"></i>
                        <span class="layout-menuitem-text">Liste des commandes</span>
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/parcels" tabindex="0">
                        <i class="pi pi-fw pi-box layout-menuitem-icon"></i>
                        <span class="layout-menuitem-text">Gesion des colis</span>
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/shipments" tabindex="0">
                        <i class="pi pi-fw pi-truck layout-menuitem-icon"></i>
                        <span class="layout-menuitem-text">Suivi des expéditions</span>
                    </RouterLink>
                </li>
            </ul>
        </li>
        <li class="menu-separator"></li>
    </ul>
</template>
