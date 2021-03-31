package org.ipdec.marfim.security.tenant;

public class TenantContext {
    private static ThreadLocal<String> currentTenant = new InheritableThreadLocal<>();

    public static String getCurrentTenant() {
        return currentTenant.get();
    }

    public static Long getLongTenant() throws NumberFormatException{
        return getCurrentTenant() == null ? null : Long.parseLong(getCurrentTenant());
    }

    public static void setCurrentTenant(String tenant) {
        if(tenant!=null && !tenant.isEmpty() && !tenant.isBlank())
        currentTenant.set(tenant);
    }

    public static void clear() {
        currentTenant.set(null);
    }
}