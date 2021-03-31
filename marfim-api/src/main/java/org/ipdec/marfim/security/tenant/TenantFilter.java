package org.ipdec.marfim.security.tenant;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class TenantFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        String tenantID = ((HttpServletRequest) request).getHeader("X-TenantID");
        //TODO: log when tenantId is missing
        TenantContext.setCurrentTenant(tenantID);

        chain.doFilter(request, response);
        TenantContext.clear();
    }
}
