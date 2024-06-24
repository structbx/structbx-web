
class SearchElements
{
    constructor(elements, search_in_element)
    {
        this.elements = elements;
        this.search_in_element = search_in_element;
        this.text_elements = new Array();
        this.searched_elements = new Array();
    }
    StringOperations_ = (words) =>
    {
        if(words.length == 0)
            return new Array();

        words = words.toLowerCase();

        words = words.replaceAll(",", "");
        words = words.split(" ");
        return words;
    }
    Filter_ = (words) =>
    {
        words = this.StringOperations_(words);

        for(let i = 0; i < $(this.elements).length; i++)
        {
            let c = $($(this.elements)[i]).find(this.search_in_element);
            if(c.length == 0)
                continue;
            
            let text_to_search = $(c).text().toLowerCase();
            let included = false;

            for(let j = 0; j < words.length; j++)
            {
                if(included)
                    continue;

                let result = text_to_search.includes(words[j]);
                if(result)
                {
                    this.searched_elements.push($(this.elements)[i]);
                    included = true;
                }
            }
        }
    }
}
