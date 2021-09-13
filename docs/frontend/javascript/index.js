// import "./nav-drawer.js"
import "./bridgetown-quick-search"

import mrujs from "mrujs"
import { AsyncConfirm } from "mrujs/plugins"
import Turbolinks from "turbolinks"
import { Application } from "stimulus"

import SideNavController from "./controllers/side_nav_controller"
import SearchController from "./controllers/search_controller"

mrujs.start({
  plugins: [
    AsyncConfirm()
  ]
})
Turbolinks.start()

const application = Application.start()
application.register("side-nav", SideNavController)
application.register("search", SearchController)

