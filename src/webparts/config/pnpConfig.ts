import { WebPartContext } from "@microsoft/sp-webpart-base";

// import pnp and pnp logging system
import { spfi, SPFI, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";

// Use an empty instance by default
var _sp: SPFI = spfi();

export const getSP = (context?: WebPartContext): SPFI => {
  if (!!context) { // eslint-disable-line eqeqeq
    _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
  }
  return _sp;
};
