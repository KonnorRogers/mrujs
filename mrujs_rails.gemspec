require_relative "lib/mrujs_rails/version"

Gem::Specification.new do |spec|
  spec.name = "mrujs_rails"
  spec.version = MrujsRails::VERSION
  spec.authors = ["ParamagicDev", "Leastbad"]
  spec.email = ["konnor5456@gmail.com"]
  spec.homepage = "https://github.com/paramagicdev/mrujs"
  spec.summary = "A rails plugin for mrujs to make Turbolinks work."
  spec.license = "MIT"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/paramagicdev/mrujs"
  spec.metadata["changelog_uri"] = "https://github.com/paramagicdev/mrujs/tree/main/CHANGELOG.md"

  spec.files = Dir["{lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  spec.add_dependency "rails", ">= 5.2", "<= 7"

  # Linting
  spec.add_development_dependency("standardrb")
end
