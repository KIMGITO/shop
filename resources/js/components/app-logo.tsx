import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-video size-28 items-center bg-transparent justify-center rounded-md text-sidebar-primary-foreground">
                <AppLogoIcon className=" fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-center text-sm">
            </div>
        </>
    );
}
