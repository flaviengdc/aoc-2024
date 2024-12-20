require 'matrix'

nl = /\n|\r|(\r\n)/
rows = File.read('example01.txt').split(nl).map{|x| x.split /\W+/}

mat = Matrix.rows(rows).transpose
freq = mat.row(1).to_a.inject({}) do |acc, x|
  acc.merge({x => acc.fetch(x, 0) + 1})
end

result = mat.row(0).to_a.collect{_1.to_i * freq.fetch(_1, 0)}.inject :+
puts result
