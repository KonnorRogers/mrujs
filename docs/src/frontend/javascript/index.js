import "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.45/dist/shoelace.js"
import "https://cdn.jsdelivr.net/npm/bridgetown-quick-search@1.1.3/frontend/dist/index.min.js"
import mrujs from "https://cdn.jsdelivr.net/npm/mrujs/dist/mrujs.module.min.js"
import Turbolinks from "https://cdn.jsdelivr.net/npm/turbolinks@5.2.0/dist/turbolinks.js"
import { Application } from "https://cdn.jsdelivr.net/npm/@hotwired/stimulus@3.0.1/dist/stimulus.min.js"

import SideNavController from "./controllers/side_nav_controller"
import SearchController from "./controllers/search_controller"

mrujs.start()
Turbolinks.start()

const application = Application.start()
application.register("side-nav", SideNavController)
application.register("search", SearchController)

