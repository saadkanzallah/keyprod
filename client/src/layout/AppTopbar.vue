<script setup>
import { computed, ref } from 'vue'
import { useLayout } from '@/layout/composables/layout';
const { onMenuToggle } = useLayout();
const topbarMenuActive = ref(false);

const logoUrl = computed(() => {
    return `/layout/images/logo.png`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});
</script>

<template>
    <div class="layout-topbar">
        <RouterLink to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <span>SAKAI</span>
        </RouterLink>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-sign-out"></i>
                <span>Sign out</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.layout-topbar {
    background-color: #1b1d20;
}
.layout-topbar .layout-topbar-button {
    color: #fff;
}
.layout-topbar .layout-topbar-button:hover{
    background-color: transparent;
}
</style>