# -*- encoding: utf-8 -*-
# stub: mapbox-gl-rails 0.51.0 ruby lib

Gem::Specification.new do |s|
  s.name = "mapbox-gl-rails".freeze
  s.version = "0.51.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Nikita Bulai".freeze]
  s.date = "2018-11-08"
  s.description = "mapbox-gl-rails provides Mapbox GL JS sources and stylesheets as a Rails engine for use with the asset pipeline.".freeze
  s.email = ["bulajnikita@gmail.com".freeze]
  s.homepage = "https://github.com/nbulaj/mapbox-gl-rails".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 1.9.3".freeze)
  s.rubygems_version = "2.7.8".freeze
  s.summary = "an asset gemification of the Mapbox GL JS library".freeze

  s.installed_by_version = "2.7.8" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<railties>.freeze, [">= 3.2", "< 6.0"])
      s.add_development_dependency(%q<activesupport>.freeze, [">= 0"])
      s.add_development_dependency(%q<sass-rails>.freeze, [">= 0"])
      s.add_development_dependency(%q<thor>.freeze, [">= 0"])
    else
      s.add_dependency(%q<railties>.freeze, [">= 3.2", "< 6.0"])
      s.add_dependency(%q<activesupport>.freeze, [">= 0"])
      s.add_dependency(%q<sass-rails>.freeze, [">= 0"])
      s.add_dependency(%q<thor>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<railties>.freeze, [">= 3.2", "< 6.0"])
    s.add_dependency(%q<activesupport>.freeze, [">= 0"])
    s.add_dependency(%q<sass-rails>.freeze, [">= 0"])
    s.add_dependency(%q<thor>.freeze, [">= 0"])
  end
end
