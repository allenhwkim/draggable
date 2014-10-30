"
" This is example of usage of singlar_expressions.txt and plural_expressions.txt in vim function
"
function! Singularize(word)
    if !exists("g:singularExpressions")
        let g:singularExpressions = []
        let list = readfile("singular_expressions.txt")
        for line in list
            let strs = split(line)
            let findEx = strs[0]
            if len(strs) == 1
                let replEx = ""
            else
                let replEx = strs[1]
            endif
            call add(g:singularExpressions, [findEx, replEx])
        endfor
    endif
    for exp in g:singularExpressions
        let findEx = substitute(exp[0], '\v^\/?|\/?i?$', '', 'g')
        let replEx = exp[1]
        if a:word =~? '\v'.findEx
            return substitute(a:word,'\v'.findEx, replEx, '')
        endif
    endfor
endfunction

function! Pluralize(word)
    if !exists("g:pluralExpressions")
        let g:pluralExpressions = []
        let list = readfile("plural_expressions.txt")
        for line in list
            let strs = split(line)
            let findEx = strs[0]
            if len(strs) == 1
                let replEx = ""
            else
                let replEx = strs[1]
            endif
            call add(g:pluralExpressions, [findEx, replEx])
        endfor
    endif
    for exp in g:pluralExpressions
        let findEx = substitute(exp[0], '\v^\/?|\/?i?$', '', 'g')
        let replEx = exp[1]
        if a:word =~? '\v'.findEx
            return substitute(a:word, '\v'.findEx, replEx, '')
        endif
    endfor
endfunction
