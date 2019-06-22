## Smart infinite scroll, how it works
Here I'll list principles for smart infinite scroll including name of props and variables. Components in this folder are working using described principles.

As inspiration I used these components:
- http://bvaughn.github.io/react-virtualized/#/components/List
- https://coderiety.github.io/react-list/

Keep in mind that in these components they have interesting optimizations, which I didn't use in my test components, due to lack of time for investigation. We should be aware that performance problems can be solved using ready components from links above as source example.


Also I used horizontal scroll as key example, if you want to do the same thing with vertical scroll, just replace all variables like:

- width -> height
- scrollLeft -> scrolLTop
- paddingLeft -> paddingTop
- itemWidth -> itemHeight
- clientWidth -> clientHeight
- etc


- Structure
    - Container (initial)
        - overflow auto or hidden (can be skipped if it is a connected container)
        - specified width or height (otherwise we won't have scrollbar inside)
            - or constrained by parent/page
        - has onScroll event listener
    - Content holder
        - width - total width (items.length * itemWidth)
        - paddingLeft -- firstElementIndex * itemWidth
        - box-sizing -- border-box (needed to prevent scroll overlap, crucial only with paddingLeft)
    - Data
        - render only part of array, from firstElementIndex to lastElementIndex
        - render in list (like divs in line)
- State
    - scrollLeft
        - how much user scrolled container
    - clientWidth
        - width of container
- Props
    - itemWidth
        - fixed width of element
    - items
        - array with all items, its length will be used to calculate total width of content holder
- Methods
    - onScroll
        - set scrollLeft and clientWidth in state

### Notes

- The whole thing with infinite scroll works thanks to notion between scrolled container, padding in holder, and continuous render of data, take at least one condition from the equation, and it won't work as you expect.


## Connected container
Connected container is a container that will behave in the same way as initial scroll container, but will do that automatically. Simplest example - header in our listings. When you scroll listing body, header will scroll itself automatically, since it is placed in separate container.
When we have infinite scroll in body container, header should have same infinite scroll as well. The only difference is that we don't scroll header manually, instead header will listen for body scroll offset and coords

### How it works
Structure and methods are basically the same as in body, in fact you shouldn't  duplicate stuff in terms of passed props/state/methods. Instead you should use already declared methods and props, since in most cases you'll have body container and connected/header container in the same react component

- Structure
    - Container
        - overflow -- hidden (if we use scrollLeft assignment)
        - specified width or height (otherwise we won't have scrollbar inside)
            - or constrained by parent/page
    - Content holder
        - width - total width (items.length * itemWidth)
        - paddingLeft -- firstElementIndex * itemWidth
        - box-sizing -- border-box (needed to prevent scroll overlap, crucial only with paddingLeft)
    - Data
        - render only part of array, from firstElementIndex to lastElementIndex
        - render in list (like divs in line)
- Methods
    - onScroll(use the one for body container)
    - assign header.scrollLeft === body.scrollLeft
        - or position absolute for content holder and left === body.scrollLeft
        - probably tranform will work as well
            - tranform will probably increase with performance
            - didn't try transform yet, so its just an assumption

As you see, the only major difference is that connected container doesn't have its own scroll event listener, instead it uses listener placed on body. And in that scroll listener we automatically change connected containers left coord (whether through assigning scrollLeft, left absolute position or even transform)
